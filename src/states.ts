import { ReadyState, OnStopping, StateError } from './startable-like';
import assert = require('assert');
import { ManualPromise } from '@zimtsui/manual-promise';
import { AgentLike, State } from './state';
import { _ } from './catch-throw';



export class Ready extends State {
	public constructor(
		protected agent: AgentLike,
		options: {},
	) { super(); }

	public activate(): void { }

	public async start(onStopping?: OnStopping): Promise<void> {
		const newState = new Starting(
			this.agent, {
			onStopping: onStopping || null,
		});
		this.agent.setState(newState);
		newState.activate();
		await this.agent.start();
	}

	public async stop(err?: Error): Promise<void> {
		assert(
			!(err instanceof Error),
			new StateError(ReadyState.READY),
		);
		const newState = new Stopped(
			this.agent, {
			starting: null,
			running: null,
			stopping: _(new ManualPromise<void>()),
			stoppingError: null,
		});
		this.agent.setState(newState);
		newState.activate();
	}

	public getReadyState(): ReadyState {
		return ReadyState.READY;
	}

	public skart(err?: Error): void {
		const startingError: Error | null = err || null;
		const starting = new ManualPromise<void>();
		const newState = new Started(
			this.agent, {
			starting,
			onStoppings: [],
			startingError,
		});
		this.agent.setState(newState);
		newState.activate();
	}

	public getRunning(): Promise<void> {
		throw new StateError(ReadyState.READY);
	}
}


export class Starting extends State {
	private starting = _(new ManualPromise<void>());
	private onStoppings: OnStopping[] = [];
	private startingError: Error | null = null;

	public constructor(
		protected agent: AgentLike,
		options: {
			onStopping: OnStopping | null;
		}
	) {
		super();
		if (options.onStopping) this.onStoppings.push(options.onStopping);
	}

	public activate(): void {
		this.agent.rawStart().catch(err => {
			this.startingError = err;
		}).then(() => {
			const newState = new Started(
				this.agent, {
				starting: this.starting,
				onStoppings: this.onStoppings,
				startingError: this.startingError,
			});
			this.agent.setState(newState);
			newState.activate();
		});
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.starting;
	}

	public async stop(err?: Error): Promise<void> {
		await this.start().catch(() => { });
		await this.agent.stop(err);
	}

	public getReadyState(): ReadyState {
		return ReadyState.STARTING;
	}

	public skart(err?: Error): never {
		throw new StateError(ReadyState.STARTING);
	}

	public getRunning(): Promise<void> {
		throw new StateError(ReadyState.STARTING);
	}
}


export class Started extends State {
	private running!: Promise<void>;
	private starting: ManualPromise<void>;
	private onStoppings: OnStopping[];
	private startingError: Error | null;

	public constructor(
		protected agent: AgentLike,
		args: {
			starting: ManualPromise<void>;
			onStoppings: OnStopping[];
			startingError: Error | null;
		},
	) {
		super();
		this.starting = args.starting;
		this.onStoppings = args.onStoppings;
		this.startingError = args.startingError;
	}

	public activate(): void {
		if (this.startingError)
			this.starting.reject(this.startingError);
		else
			this.starting.resolve();

		this.running = _(new Promise<void>((resolve, reject) => {
			_(this.start(err => {
				if (err) reject(err);
				else resolve();
			}));
		}));
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.starting;
	}

	public async stop(runningError?: Error): Promise<void> {
		const newState = new Stopping(
			this.agent, {
			starting: _(Promise.resolve(this.starting)),
			running: this.running,
			onStoppings: this.onStoppings,
			runningError: runningError || null,
		});
		this.agent.setState(newState);
		newState.activate();
		await this.agent.stop();
	}

	public getReadyState(): ReadyState {
		return ReadyState.STARTED;
	}

	public skart(err?: Error): never {
		throw new StateError(ReadyState.STARTED);
	}

	public getRunning(): Promise<void> {
		return this.running;
	}
}


export class Stopping extends State {
	private starting: Promise<void>;
	private running: Promise<void>;
	private stopping = _(new ManualPromise<void>());
	private onStoppings: OnStopping[];
	private runningError: Error | null;
	private stoppingError: Error | null = null;

	public constructor(
		protected agent: AgentLike,
		args: {
			starting: Promise<void>;
			running: Promise<void>;
			onStoppings: OnStopping[];
			runningError: Error | null;
		},
	) {
		super();
		this.starting = args.starting;
		this.running = args.running;
		this.onStoppings = args.onStoppings;
		this.runningError = args.runningError;
	}

	public activate(): void {
		if (this.runningError)
			for (const onStopping of this.onStoppings)
				onStopping(this.runningError);
		else
			for (const onStopping of this.onStoppings)
				onStopping();

		(
			this.runningError
				? this.agent.rawStop(this.runningError)
				: this.agent.rawStop()
		).catch(err => {
			this.stoppingError = err;
		}).then(() => {
			const newState = new Stopped(
				this.agent, {
				starting: this.starting,
				running: this.running,
				stopping: this.stopping,
				stoppingError: this.stoppingError,
			});
			this.agent.setState(newState);
			newState.activate();
		});
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		if (onStopping) onStopping();
		return this.starting;
	}

	public async stop(err?: Error): Promise<void> {
		await this.stopping;
	}

	public getReadyState(): ReadyState {
		return ReadyState.STOPPING;
	}

	public skart(err?: Error): never {
		throw new StateError(ReadyState.STOPPING);
	}

	public getRunning(): Promise<void> {
		return this.running;
	}
}


export class Stopped extends State {
	private starting: Promise<void> | null;
	private running: Promise<void> | null;
	private stopping: ManualPromise<void>;
	private stoppingError: Error | null;

	public constructor(
		protected agent: AgentLike,
		args: {
			starting: Promise<void> | null;
			running: Promise<void> | null;
			stopping: ManualPromise<void>;
			stoppingError: Error | null;
		},
	) {
		super();
		this.starting = args.starting;
		this.running = args.running;
		this.stopping = args.stopping;
		this.stoppingError = args.stoppingError;
	}

	public activate(): void {
		if (this.stoppingError)
			this.stopping.reject(this.stoppingError);
		else
			this.stopping.resolve();
	}

	public start(onStopping?: OnStopping): Promise<void> {
		assert(
			this.starting !== null,
			new ReferenceError(),
		);
		if (onStopping) onStopping();
		return this.starting;
	}

	public async stop(): Promise<void> {
		await this.stopping;
	}

	public getReadyState(): ReadyState {
		return ReadyState.STOPPED;
	}

	public skart(err?: Error): void {
		throw new StateError(ReadyState.STOPPED);
	}

	public getRunning(): Promise<void> {
		assert(
			this.running !== null,
			new ReferenceError(),
		);
		return this.running;
	}
}
