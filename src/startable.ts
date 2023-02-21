import { boundMethod } from 'autobind-decorator';
import { catchThrow } from './catch-throw';
import { StartableLike, ReadyState, OnStopping, StateError, RawStart, RawStop } from './interfaces';
import * as Interfaces from './interfaces';
import assert = require('assert');
import { ManualPromise } from '@zimtsui/manual-promise';



export abstract class State implements StartableLike {
	protected abstract host: Friendly;

	public abstract activate(): void;
	public abstract getState(): ReadyState;
	public abstract start(onStopping?: OnStopping): PromiseLike<void>;
	public abstract skart(err?: Error): void;
	public abstract stop(err?: Error): Promise<void>;
	public abstract getRunning(): PromiseLike<void>;
	public abstract assertState(expected: ReadyState[]): void;
}


export interface Startable extends StartableLike {
	getState(): ReadyState;

	/**
	 * @throws {@link Startable.StateError}
	 * @defaultValue `[ReadyState.STARTED]`
	 */
	assertState(expected: ReadyState[]): void;

	/**
	 * Skip from `READY` to `STARTED`.
	 */
	skart(startingError?: Error): void;

	/**
	 * 1. If it's `READY` now, then
	 * 	1. Start.
	 * 1. Return the promise of `STARTING`.
	 * @decorator `@boundMethod`
	 * @throws ReferenceError
	 */
	start(onStopping?: OnStopping): PromiseLike<void>;

	/**
	 * - If it's `READY` now, then
	 * 	1. Skip to `STOPPED`.
	 * - If it's `STARTING` now and `err` is given, then
	 * 	1. Make the `STARTING` process throw `err`.
	 * - Otherwise,
	 * 	1. If it's `STARTING` now and `err` is not given, then
	 * 		1. Wait until `STARTED`.
	 * 	1. If it's `STARTED` now, then
	 * 		1. Stop.
	 * 	1. If it's `STOPPING` or `STOPPED` now, then
	 * 		1. Return the promise of `STOPPING`.
	 * @decorator `@boundMethod`
	 * @decorator `@catchThrow()`
	 */
	stop(err?: Error): Promise<void>;

	/**
	 * @throws ReferenceError
	 */
	getRunning(): PromiseLike<void>;
}
export namespace Startable {
	export import RawStart = Interfaces.RawStart;
	export import RawStop = Interfaces.RawStop;
	export import OnStopping = Interfaces.OnStopping;
	export import ReadyState = Interfaces.ReadyState;
	export import StateError = Interfaces.StateError;

	export function create(
		rawStart: RawStart,
		rawStop: RawStop,
	): Startable {
		return new Friendly(
			rawStart,
			rawStop,
		);
	}
}



export class Friendly implements Startable {
	public state: State;

	public constructor(
		public rawStart: RawStart,
		public rawStop: RawStop,
	) {
		this.state = new Ready(this, {});
		this.state.activate();
	}

	public getState(): ReadyState {
		return this.state.getState();
	}

	public assertState(
		expected: ReadyState[] = [ReadyState.STARTED],
	): void {
		this.state.assertState(expected);
	}

	public skart(startingError?: Error): void {
		this.state.skart(startingError);
	}

	@boundMethod
	public start(onStopping?: OnStopping): PromiseLike<void> {
		return this.state.start(onStopping);
	}

	@boundMethod
	@catchThrow()
	public async stop(err?: Error): Promise<void> {
		return await this.state.stop(err);
	}

	public getRunning(): PromiseLike<void> {
		return this.state.getRunning();
	}
}



export class Ready extends State {
	public constructor(
		protected host: Friendly,
		options: {},
	) { super(); }

	public activate(): void { }

	public assertState(expected: ReadyState[]): void {
		assert(
			expected.includes(ReadyState.READY),
			new StateError(ReadyState.READY, expected),
		);
	}

	@catchThrow()
	public async start(onStopping?: OnStopping): Promise<void> {
		this.host.state = new Starting(
			this.host, {
			onStopping: onStopping || null,
		});
		this.host.state.activate();
		await this.host.start();
	}

	public async stop(err?: Error): Promise<void> {
		assert(
			!(err instanceof Error),
			new StateError(ReadyState.READY),
		);
		this.host.state = new Stopped(
			this.host, {
			startingPromise: null,
			runningPromise: null,
			stoppingPromise: new ManualPromise<void>(),
			stoppingError: null,
		});
		this.host.state.activate();
	}

	public getState(): ReadyState {
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
		this.host.state.activate();
	}

	public getRunning(): PromiseLike<void> {
		throw new StateError(ReadyState.READY);
	}
}


export class Starting extends State {
	private startingPromise = new ManualPromise<void>();
	private onStoppings: OnStopping[] = [];
	private startingErrors: Error[] = [];

	public constructor(
		protected host: Friendly,
		options: {
			onStopping: OnStopping | null;
		}
	) {
		super();

		if (options.onStopping) this.onStoppings.push(options.onStopping);
	}

	public assertState(expected: ReadyState[]): void {
		assert(
			expected.includes(ReadyState.STARTING),
			new StateError(ReadyState.STARTING, expected),
		);
	}

	public activate(): void {
		this.host.rawStart().catch(err => {
			this.startingErrors.push(err);
		}).then(() => {
			this.host.state = new Started(
				this.host, {
				startingPromise: this.startingPromise,
				onStoppings: this.onStoppings,
				startingError: this.startingErrors.length === 0
					? null
					: this.startingErrors.length === 1
						? this.startingErrors[0]
						: new AggregateError(this.startingErrors),
			});
			this.host.state.activate();
		});
	}

	@catchThrow()
	public async start(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async stop(err?: Error): Promise<void> {
		if (err) {
			this.startingErrors.push(err);
			throw new StateError(ReadyState.STARTING);
		} else {
			await this.startingPromise.catch(() => { });
			await this.host.stop();
		}
	}

	public getState(): ReadyState {
		return ReadyState.STARTING;
	}

	public skart(err?: Error): never {
		throw new StateError(ReadyState.STARTING);
	}

	public getRunning(): PromiseLike<void> {
		throw new StateError(ReadyState.STARTING);
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

	public assertState(expected: ReadyState[]): void {
		assert(
			expected.includes(ReadyState.STARTED),
			new StateError(ReadyState.STARTED, expected),
		);
	}

	public activate(): void {
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

	@catchThrow()
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
		this.host.state.activate();
		await this.host.stop();
	}

	public getState(): ReadyState {
		return ReadyState.STARTED;
	}

	public skart(err?: Error): never {
		throw new StateError(ReadyState.STARTED);
	}

	public getRunning(): PromiseLike<void> {
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

	public assertState(expected: ReadyState[]): void {
		assert(
			expected.includes(ReadyState.STOPPING),
			new StateError(ReadyState.STOPPING, expected),
		);
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
			this.host.state.activate();
		});
	}

	@catchThrow()
	public async start(onStopping?: OnStopping): Promise<void> {
		if (onStopping) onStopping();
		return this.startingPromise;
	}

	public async stop(err?: Error): Promise<void> {
		await this.stoppingPromise;
	}

	public getState(): ReadyState {
		return ReadyState.STOPPING;
	}

	public skart(err?: Error): never {
		throw new StateError(ReadyState.STOPPING);
	}

	public getRunning(): PromiseLike<void> {
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

	public assertState(expected: ReadyState[]): void {
		assert(
			expected.includes(ReadyState.STOPPED),
			new StateError(ReadyState.STOPPED, expected),
		);
	}

	public activate(): void {
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

	public getState(): ReadyState {
		return ReadyState.STOPPED;
	}

	public skart(err?: Error): void {
		throw new StateError(ReadyState.STOPPED);
	}

	public getRunning(): PromiseLike<void> {
		assert(
			this.runningPromise !== null,
			new ReferenceError(),
		);
		return this.runningPromise;
	}
}
