import { ReadyState, OnStopping, StateError } from './startable-like';
import assert = require('assert');
import { ManualPromise } from '@zimtsui/coroutine-locks';
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
			rawStopping: Promise.resolve(),
		});
		this.agent.setState(newState);
		newState.activate();
	}

	public getReadyState(): ReadyState {
		return ReadyState.READY;
	}

	public skart(err?: Error): void {
		const rawStarting = err ? Promise.reject(err) : Promise.resolve();
		const starting = new ManualPromise<void>();
		const newState = new Started(
			this.agent, {
			starting,
			onStoppings: [],
			rawStarting,
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
		const rawStarting = _(this.agent.rawStart());
		rawStarting.catch(() => { }).then(() => {
			const newState = new Started(
				this.agent, {
				starting: this.starting,
				onStoppings: this.onStoppings,
				rawStarting,
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
	private rawStarting: Promise<void>;

	public constructor(
		protected agent: AgentLike,
		options: {
			starting: ManualPromise<void>;
			onStoppings: OnStopping[];
			rawStarting: Promise<void>;
		},
	) {
		super();
		this.starting = options.starting;
		this.onStoppings = options.onStoppings;
		this.rawStarting = options.rawStarting;
	}

	public activate(): void {
		this.starting.resolve(this.rawStarting);

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

	public constructor(
		protected agent: AgentLike,
		options: {
			starting: Promise<void>;
			running: Promise<void>;
			onStoppings: OnStopping[];
			runningError: Error | null;
		},
	) {
		super();
		this.starting = options.starting;
		this.running = options.running;
		this.onStoppings = options.onStoppings;
		this.runningError = options.runningError;
	}

	public activate(): void {
		if (this.runningError)
			for (const onStopping of this.onStoppings)
				onStopping(this.runningError);
		else
			for (const onStopping of this.onStoppings)
				onStopping();

		const rawStopping = _(this.runningError
			? this.agent.rawStop(this.runningError)
			: this.agent.rawStop());

		rawStopping.catch(() => { }).then(() => {
			const newState = new Stopped(
				this.agent, {
				starting: this.starting,
				running: this.running,
				stopping: this.stopping,
				rawStopping,
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
	private rawStopping: Promise<void>;

	public constructor(
		protected agent: AgentLike,
		options: {
			starting: Promise<void> | null;
			running: Promise<void> | null;
			stopping: ManualPromise<void>;
			rawStopping: Promise<void>;
		},
	) {
		super();
		this.starting = options.starting;
		this.running = options.running;
		this.stopping = options.stopping;
		this.rawStopping = options.rawStopping;
	}

	public activate(): void {
		this.stopping.resolve(this.rawStopping);
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
