import {
	State,
	Friendly,
	OnStopping,
	ReadyState,
} from './startable';
import { ManualPromise } from '@zimtsui/manual-promise';


export class Ready extends State {
	public constructor(
		protected host: Friendly,
		args: {},
	) {
		super();
	}

	public postActivate(): void { }

	public async start(
		onStopping?: OnStopping,
	): Promise<void> {
		this.host.state = new Starting(
			this.host, {
			onStopping: onStopping || null,
		});
		this.host.state.postActivate();
		await this.host.start();
	}

	public async assart(onStopping?: OnStopping): Promise<never> {
		throw new CannotAssartDuringReady();
	}

	public async stop(): Promise<void> {
		throw new CannotStopDuringReady();
	}

	public async starp(err?: Error): Promise<void> {
		const stoppingError = new SkipFromReadyToStopped();
		const startingPromise = Promise.reject(stoppingError);
		startingPromise.catch(() => { });
		const runningPromise = Promise.reject(stoppingError);
		runningPromise.catch(() => { });
		this.host.state = new Stopped(
			this.host, {
			startingPromise,
			runningPromise,
			stoppingPromise: new ManualPromise<void>(),
			stoppingError,
		});
		this.host.state.postActivate();
	}

	public getReadyState(): ReadyState {
		return ReadyState.READY;
	}

	public skipStart(onStopping?: OnStopping): void {
		const startingError = new SkipFromReadytoStarted();
		this.host.state = new Started(
			this.host, {
			startingPromise: new ManualPromise<void>(),
			onStoppings: onStopping ? [onStopping] : [],
			startingError,
		});
		this.host.state.postActivate();
	}

	public getRunningPromise(): PromiseLike<void> {
		throw new CannotGetRunningPromiseDuringReady();
	}
}

export class CannotGetRunningPromiseDuringReady extends Error { }
export class CannotStopDuringReady extends Error { }
export class CannotAssartDuringReady extends Error { }
export class SkipFromReadyToStopped extends Error { }
export class SkipFromReadytoStarted extends Error { }


export class Starting extends State {
	private startingPromise = new ManualPromise<void>();
	private onStoppings: OnStopping[] = [];
	private startingError: null | StarpCalledDuringStarting = null;

	public constructor(
		protected host: Friendly,
		args: {
			onStopping: OnStopping | null;
		}
	) {
		super();

		if (args.onStopping) this.onStoppings.push(args.onStopping);
	}

	public postActivate(): void {
		this.host.rawStart().catch(err => {
			this.startingError = err;
		}).then(() => {
			this.host.state = new Started(
				this.host, {
				startingPromise: this.startingPromise,
				onStoppings: this.onStoppings,
				startingError: this.startingError,
			});
			this.host.state.postActivate();
		});
	}

	public async start(
		onStopping?: OnStopping,
	): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async assart(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async stop(err?: Error): Promise<void> {
		throw new CannotStopDuringStarting();
	}

	public async starp(err?: Error): Promise<void> {
		this.startingError = new StarpCalledDuringStarting();
		await this.startingPromise.catch(() => { });
		await this.host.stop(err);
	}

	public getReadyState(): ReadyState {
		return ReadyState.STARTING;
	}

	public skipStart(onStopping?: OnStopping): never {
		throw new CannotSkipStartDuringStarting();
	}

	public getRunningPromise(): PromiseLike<void> {
		throw new CannotGetRunningPromiseDuringStarting();
	}
}

export class CannotGetRunningPromiseDuringStarting extends Error { }
export class StarpCalledDuringStarting extends Error { }
export class CannotSkipStartDuringStarting extends Error { }
export class CannotStopDuringStarting extends Error { }


export class Started extends State {
	private running!: PromiseLike<void>;
	private startingPromise: ManualPromise<void>;
	private onStoppings: OnStopping[];
	private startingError: Error | null;

	public constructor(
		protected host: Friendly,
		args: {
			startingPromise: ManualPromise<void>;
			onStoppings: OnStopping[];
			startingError: Error | null;
		},
	) {
		super();
		this.startingPromise = args.startingPromise;
		this.onStoppings = args.onStoppings;
		this.startingError = args.startingError;
	}

	public postActivate(): void {
		if (this.startingError) this.startingPromise.reject(this.startingError);
		else this.startingPromise.resolve();

		const running = new Promise<void>((resolve, reject) => {
			this.start(err => {
				if (err) reject(err);
				else resolve();
			}).catch(() => { });
		});
		running.catch(() => { });
		this.running = running;
	}

	public async start(
		onStopping?: OnStopping,
	): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async assart(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async stop(runningError?: Error): Promise<void> {
		this.host.state = new Stopping(
			this.host, {
			startingPromise: this.startingPromise,
			runningPromise: this.running,
			onStoppings: this.onStoppings,
			runningError: runningError || null,
		});
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

	public getRunningPromise(): PromiseLike<void> {
		return this.running;
	}
}

export class CannotSkipStartDuringStarted extends Error { }



export class Stopping extends State {
	private startingPromise: PromiseLike<void>;
	private runningPromise: PromiseLike<void>;
	private stoppingPromise = new ManualPromise<void>();
	private onStoppings: OnStopping[];
	private runningError: Error | null;
	private stoppingError: Error | null = null;

	public constructor(
		protected host: Friendly,
		args: {
			startingPromise: PromiseLike<void>;
			runningPromise: PromiseLike<void>;
			onStoppings: OnStopping[];
			runningError: Error | null;
		},
	) {
		super();
		this.startingPromise = args.startingPromise;
		this.runningPromise = args.runningPromise;
		this.onStoppings = args.onStoppings;
		this.runningError = args.runningError;
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
		).catch(err => {
			this.stoppingError = err;
		}).then(() => {
			this.host.state = new Stopped(
				this.host, {
				startingPromise: this.startingPromise,
				runningPromise: this.runningPromise,
				stoppingPromise: this.stoppingPromise,
				stoppingError: this.stoppingError,
			});
			this.host.state.postActivate();
		});
	}

	public async start(
		onStopping?: OnStopping,
	): Promise<void> {
		return this.startingPromise;
	}

	public async assart(onStopping?: OnStopping): Promise<never> {
		throw new CannotAssartDuringStopping();
	}

	public async stop(err?: Error): Promise<void> {
		await this.stoppingPromise;
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

	public getRunningPromise(): PromiseLike<void> {
		return this.runningPromise;
	}
}

export class CannotSkipStartDuringStopping extends Error { }
export class CannotAssartDuringStopping extends Error { }



export class Stopped extends State {
	private startingPromise: PromiseLike<void>;
	private runningPromise: PromiseLike<void>;
	private stoppingPromise: ManualPromise<void>;
	private stoppingError: Error | null;

	public constructor(
		protected host: Friendly,
		args: {
			startingPromise: PromiseLike<void>;
			runningPromise: PromiseLike<void>;
			stoppingPromise: ManualPromise<void>;
			stoppingError: Error | null;
		},
	) {
		super();
		this.startingPromise = args.startingPromise;
		this.runningPromise = args.runningPromise;
		this.stoppingPromise = args.stoppingPromise;
		this.stoppingError = args.stoppingError;
	}

	public postActivate(): void {
		if (this.stoppingError)
			this.stoppingPromise.reject(this.stoppingError);
		else
			this.stoppingPromise.resolve();
	}

	public async start(
		onStopping?: OnStopping,
	): Promise<void> {
		return this.startingPromise;
	}

	public async assart(onStopping?: OnStopping): Promise<never> {
		throw new CannotAssartDuringStopped();
	}

	public async stop(): Promise<void> {
		await this.stoppingPromise;
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

	public getRunningPromise(): PromiseLike<void> {
		return this.runningPromise;
	}
}

export class CannotSkipStartDuringStopped extends Error { }
export class CannotStarpDuringStopped extends Error { }
export class CannotAssartDuringStopped extends Error { }
