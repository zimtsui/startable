import {
	State,
	Friendly,
	OnStopping,
	ReadyState,
	StateError,
} from './startable';
import { ManualPromise } from '@zimtsui/manual-promise';
import assert = require('assert');


export class Ready extends State {
	public constructor(
		protected host: Friendly,
		args: {},
	) {
		super();
	}

	public postActivate(): void { }

	public async start(onStopping?: OnStopping): Promise<void> {
		this.host.state = new Starting(
			this.host, {
			onStopping: onStopping || null,
		});
		this.host.state.postActivate();
		await this.host.start();
	}

	public async stop(err?: Error): Promise<void> {
		assert(
			typeof err === 'undefined',
			new StateError(
				'stop with an exception',
				ReadyState.READY,
			),
		);
		this.host.state = new Stopped(
			this.host, {
			startingPromise: null,
			runningPromise: null,
			stoppingPromise: new ManualPromise<void>(),
			stoppingError: null,
		});
		this.host.state.postActivate();
	}

	public getReadyState(): ReadyState {
		return ReadyState.READY;
	}

	public skart(err?: Error): void {
		const startingError: Error | null = err || null;
		this.host.state = new Started(
			this.host, {
			startingPromise: new ManualPromise<void>(),
			onStoppings: [],
			startingError,
		});
		this.host.state.postActivate();
	}

	public getRunningPromise(): PromiseLike<void> {
		throw new StateError(
			'getRunningPromise', ReadyState.READY,
		);
	}
}


export class Starting extends State {
	private startingPromise = new ManualPromise<void>();
	private onStoppings: OnStopping[] = [];
	private startingErrors: Error[] = [];

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
			this.startingErrors.push(err);
		}).then(() => {
			this.host.state = new Started(
				this.host, {
				startingPromise: this.startingPromise,
				onStoppings: this.onStoppings,
				startingError: new AggregateError(this.startingErrors),
			});
			this.host.state.postActivate();
		});
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async stop(err?: Error): Promise<void> {
		if (err) {
			this.startingErrors.push(err);
			throw new StateError('stop', ReadyState.STARTING);
		} else {
			await this.startingPromise.catch(() => { });
			await this.host.stop();
		}
	}

	public getReadyState(): ReadyState {
		return ReadyState.STARTING;
	}

	public skart(err?: Error): never {
		throw new StateError(
			'skart', ReadyState.STARTING,
		);
	}

	public getRunningPromise(): PromiseLike<void> {
		throw new StateError(
			'getRunningPromise', ReadyState.STARTING,
		);
	}
}


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
		if (this.startingError)
			this.startingPromise.reject(this.startingError);
		else
			this.startingPromise.resolve();

		const running = new Promise<void>((resolve, reject) => {
			this.start(err => {
				if (err) reject(err);
				else resolve();
			}).catch(() => { });
		});
		running.catch(() => { });
		this.running = running;
	}

	public async start(onStopping?: OnStopping): Promise<void> {
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

	public getReadyState(): ReadyState {
		return ReadyState.STARTED;
	}

	public skart(err?: Error): never {
		throw new StateError(
			'skart', ReadyState.STARTED,
		);
	}

	public getRunningPromise(): PromiseLike<void> {
		return this.running;
	}
}


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

	public async start(onStopping?: OnStopping): Promise<void> {
		if (onStopping) onStopping();
		return this.startingPromise;
	}

	public async stop(err?: Error): Promise<void> {
		await this.stoppingPromise;
	}

	public getReadyState(): ReadyState {
		return ReadyState.STOPPING;
	}

	public skart(err?: Error): never {
		throw new StateError(
			'skart', ReadyState.STOPPING,
		);
	}

	public getRunningPromise(): PromiseLike<void> {
		return this.runningPromise;
	}
}


export class Stopped extends State {
	private startingPromise: PromiseLike<void> | null;
	private runningPromise: PromiseLike<void> | null;
	private stoppingPromise: ManualPromise<void>;
	private stoppingError: Error | null;

	public constructor(
		protected host: Friendly,
		args: {
			startingPromise: PromiseLike<void> | null;
			runningPromise: PromiseLike<void> | null;
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

	public start(onStopping?: OnStopping): PromiseLike<void> {
		assert(
			this.startingPromise !== null,
			new ReferenceError(),
		);
		if (onStopping) onStopping();
		return this.startingPromise;
	}

	public async stop(): Promise<void> {
		await this.stoppingPromise;
	}

	public getReadyState(): ReadyState {
		return ReadyState.STOPPED;
	}

	public skart(err?: Error): void {
		throw new StateError(
			'skart', ReadyState.STOPPED,
		)
	}

	public getRunningPromise(): PromiseLike<void> {
		assert(
			this.runningPromise !== null,
			new ReferenceError(),
		);
		return this.runningPromise;
	}
}
