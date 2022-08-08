import {
	Startable,
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
		const nextState = new Starting(
			this.host,
			onStopping,
		);
		this.host.state = nextState;
		nextState.postActivate();
		await this.host.start();
	}

	public async assart(onStopping?: OnStopping): Promise<never> {
		throw new CannotAssartDuringReady();
	}

	public async stop(): Promise<void> {
		const nextState = new Stopped(
			this.host,
			Promise.resolve(),
		);
		this.host.state = nextState;
		nextState.postActivate();
	}

	public async starp(err?: Error): Promise<never> {
		throw new CannotStarpDuringReady();
	}

	public getReadyState(): ReadyState {
		return ReadyState.READY;
	}

	public skipStart(onStopping?: OnStopping): void {
		const nextState = new Started(
			this.host,
			Promise.resolve(),
			onStopping ? [onStopping] : [],
		);
		this.host.state = nextState;
		nextState.postActivate();
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
	private starting = new PublicManualPromise<void>();
	private onStoppings: OnStopping[] = [];
	private err: null | StarpCalledDuringStarting = null;

	public constructor(
		protected host: Friendly,
		onStopping?: OnStopping,
	) {
		super();
		this.starting.catch(() => { });
		if (onStopping) this.onStoppings.push(onStopping);
	}

	public postActivate(): void {
		this.host.rawStart().then(() => {
			if (this.err) throw this.err;
			this.starting.resolve();
		}).catch((err: Error) => {
			this.starting.reject(err);
		}).then(() => {
			const nextState = new Started(
				this.host,
				this.starting,
				this.onStoppings,
			);
			this.host.state = nextState;
			nextState.postActivate();
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
		this.err = new StarpCalledDuringStarting();
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
		private starting: Promise<void>,
		private onStoppings: OnStopping[],
	) {
		super();
	}

	public postActivate(): void { }

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
		const nextState = new Stopping(
			this.host,
			this.starting,
			this.onStoppings,
			err,
		);
		this.host.state = nextState;
		nextState.postActivate();
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
		private err?: Error,
	) {
		super();
	}

	public postActivate(): void {
		for (const onStopping of this.onStoppings)
			onStopping(this.err);

		this.host.rawStop(this.err).then(() => {
			this.stopping.resolve();
		}).catch((err: Error) => {
			this.stopping.reject(err);
		}).then(() => {
			const nextState = new Stopped(
				this.host,
				this.stopping,
			);
			(<Friendly>this.host).state = nextState;
			nextState.postActivate();
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
		protected host: Startable,
		private stopping: Promise<void>,
	) {
		super();
	}

	public postActivate(): void { }

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
