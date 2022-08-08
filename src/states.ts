import {
	State,
	Friendly,
} from './startable';
import {
	OnStopping,
	ReadyState,
} from './startable-like';
import { PublicManualPromise } from '@zimtsui/manual-promise';


export class Ready extends State {
	public constructor(
		protected host: Friendly,
	) {
		super();
	}

	public postActivate(): void { }

	public async start(
		onStopping?: OnStopping,
	): Promise<void> {
		this.host.state = new Starting(
			this.host,
			onStopping || null,
		);
		this.host.state.postActivate();
		await this.host.start();
	}

	public async assart(onStopping?: OnStopping): Promise<never> {
		throw new CannotAssartDuringReady();
	}

	public async stop(): Promise<void> {
		this.host.state = new Stopped(
			this.host,
			new PublicManualPromise<void>(),
			null,
			null,
			null,
		);
		this.host.state.postActivate();
	}

	public async starp(err?: Error): Promise<never> {
		throw new CannotStarpDuringReady();
	}

	public getReadyState(): ReadyState {
		return ReadyState.READY;
	}

	public skipStart(onStopping?: OnStopping): void {
		this.host.state = new Started(
			this.host,
			new PublicManualPromise<void>(),
			onStopping ? [onStopping] : [],
			null,
		);
		this.host.state.postActivate();
	}

	public getStarting(): Promise<void> {
		throw new CannotGetStartingDuringReady();
	}

	public getStopping(): Promise<void> {
		throw new CannotGetStoppingDuringReady();
	}
}

export class CannotStarpDuringReady extends Error { }
export class CannotAssartDuringReady extends Error { }
export class CannotGetStartingDuringReady extends Error { }
export class CannotGetStoppingDuringReady extends Error { }


export class Starting extends State {
	private starting = new PublicManualPromise<void>()
	private onStoppings: OnStopping[] = [];
	private startingError: null | StarpCalledDuringStarting = null;

	public constructor(
		protected host: Friendly,
		onStopping: OnStopping | null,
	) {
		super();

		if (onStopping) this.onStoppings.push(onStopping);
	}

	public postActivate(): void {
		this.host.rawStart().catch(err => {
			this.startingError = err;
		}).then(() => {
			this.host.state = new Started(
				this.host,
				this.starting,
				this.onStoppings,
				this.startingError,
			);
			this.host.state.postActivate();
		});
	}

	public async start(
		onStopping?: OnStopping,
	): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.starting;
	}

	public async assart(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.starting;
	}

	public async stop(err?: Error): Promise<void> {
		throw new CannotStopDuringStarting();
	}

	public async starp(err?: Error): Promise<void> {
		this.startingError = new StarpCalledDuringStarting();
		await this.starting.catch(() => { });
		await this.host.stop(err);
	}

	public getReadyState(): ReadyState {
		return ReadyState.STARTING;
	}

	public skipStart(onStopping?: OnStopping): never {
		throw new CannotSkipStartDuringStarting();
	}

	public getStarting(): Promise<void> {
		return this.starting;
	}

	public getStopping(): Promise<void> {
		throw new CannotGetStoppingDuringStarting();
	}
}

export class StarpCalledDuringStarting extends Error { }
export class CannotSkipStartDuringStarting extends Error { }
export class CannotStopDuringStarting extends Error { }
export class CannotGetStoppingDuringStarting extends Error { }


export class Started extends State {
	public constructor(
		protected host: Friendly,
		private starting: PublicManualPromise<void>,
		private onStoppings: OnStopping[],
		private startingError: Error | null,
	) {
		super();
	}

	public postActivate(): void {
		if (this.startingError) this.starting.reject(this.startingError);
		else this.starting.resolve();
	}

	public async start(
		onStopping?: OnStopping,
	): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.starting;
	}

	public async assart(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.starting;
	}

	public async stop(runningError?: Error): Promise<void> {
		this.host.state = new Stopping(
			this.host,
			this.starting,
			this.onStoppings,
			this.startingError,
			runningError || null,
		);
		this.host.state.postActivate();
		await this.host.stop();
	}

	public async starp(err?: Error): Promise<void> {
		await this.stop(err);
	}

	public getReadyState(): ReadyState {
		return ReadyState.STARTED;
	}

	public skipStart(onStopping?: OnStopping): never {
		throw new CannotSkipStartDuringStarted();
	}

	public getStarting(): Promise<void> {
		return this.starting;
	}

	public getStopping(): Promise<void> {
		throw new CannotGetStoppingDuringStarted();
	}
}

export class CannotSkipStartDuringStarted extends Error { }
export class CannotGetStoppingDuringStarted extends Error { }



export class Stopping extends State {
	private stopping = new PublicManualPromise<void>();

	public constructor(
		protected host: Friendly,
		private starting: Promise<void>,
		private onStoppings: OnStopping[],
		private startingError: Error | null,
		private runningError: Error | null,
	) {
		super();
	}

	public postActivate(): void {
		if (this.runningError)
			for (const onStopping of this.onStoppings)
				onStopping(this.runningError);
		else
			for (const onStopping of this.onStoppings)
				onStopping();

		(
			this.runningError
				? this.host.rawStop(this.runningError)
				: this.host.rawStop()
		).then(() => {
			this.host.state = new Stopped(
				this.host,
				this.stopping,
				this.startingError,
				this.runningError,
				null,
			);
			this.host.state.postActivate();
		}).catch((stoppingError: Error) => {
			this.host.state = new Stopped(
				this.host,
				this.stopping,
				this.startingError,
				this.runningError,
				stoppingError,
			);;
			this.host.state.postActivate();
		});
	}

	public async start(
		onStopping?: OnStopping,
	): Promise<void> {
		throw new CannotStartDuringStopping();
	}

	public async assart(onStopping?: OnStopping): Promise<never> {
		throw new CannotAssartDuringStopping();
	}

	public async stop(err?: Error): Promise<void> {
		await this.stopping;
	}

	public async starp(err?: Error): Promise<void> {
		await this.stop(err);
	}

	public getReadyState(): ReadyState {
		return ReadyState.STOPPING;
	}

	public skipStart(onStopping?: OnStopping): never {
		throw new CannotSkipStartDuringStopping();
	}

	public getStarting(): Promise<void> {
		return this.starting;
	}

	public getStopping(): Promise<void> {
		return this.stopping;
	}
}

export class CannotSkipStartDuringStopping extends Error { }
export class CannotAssartDuringStopping extends Error { }
export class CannotStartDuringStopping extends Error { }



export class Stopped extends State {
	public constructor(
		protected host: Friendly,
		private stopping: PublicManualPromise<void>,
		private startingError: Error | null,
		private runningError: Error | null,
		private stoppingError: Error | null,
	) {
		super();
	}

	public postActivate(): void {
		if (this.startingError)
			this.host.reject(this.startingError);
		else if (this.runningError)
			this.host.reject(this.runningError);
		else if (this.stoppingError)
			this.host.reject(this.stoppingError);
		else
			this.host.resolve();

		if (this.stoppingError)
			this.stopping.reject(this.stoppingError);
		else
			this.stopping.resolve();
	}

	public async start(
		onStopping?: OnStopping,
	): Promise<void> {
		throw new CannotStartDuringStopped();
	}

	public async assart(onStopping?: OnStopping): Promise<never> {
		throw new CannotAssartDuringStopped();
	}

	public async stop(): Promise<void> {
		await this.stopping;
	}

	public async starp(err?: Error): Promise<never> {
		throw new CannotStarpDuringStopped();
	}

	public getReadyState(): ReadyState {
		return ReadyState.STOPPED;
	}

	public skipStart(onStopping?: OnStopping): void {
		throw new CannotSkipStartDuringStopped();
	}

	public getStarting(): Promise<void> {
		throw new CannotGetStartingDuringStopped();
	}

	public getStopping(): Promise<void> {
		return this.stopping;
	}
}

export class CannotStartDuringStopped extends Error { }
export class CannotSkipStartDuringStopped extends Error { }
export class CannotStarpDuringStopped extends Error { }
export class CannotAssartDuringStopped extends Error { }
export class CannotGetStartingDuringStopped extends Error { }
