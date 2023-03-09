import { boundMethod } from "autobind-decorator";
import { catchThrow } from "./catch-throw";
import { OnStopping, AsyncRawStart, AsyncRawStop, ReadyState, StartableLike, StateError, RawStart, RawStop } from "./startable-like";
import { AgentLike, State } from "./state";
import { Ready } from "./states";



export class Startable implements StartableLike {
	private state: State;

	public constructor(
		rawStart: RawStart,
		rawStop: RawStop,
	) {
		const asyncRawStart: AsyncRawStart = async () => await rawStart();
		const asyncRawStop: AsyncRawStop = async (err?: Error) => await rawStop(err);
		this.state = new Ready(
			new Agent(
				this, {
				getState: () => this.state,
				setState: (newState: State) => { this.state = newState; },
				asyncRawStart,
				asyncRawStop,
			}), {},
		);
		this.state.activate();
	}

	public getReadyState(): ReadyState {
		return this.state.getReadyState();
	}

	/**
	 *  @throws {@link StateError}
	 *  @defaultValue `[ReadyState.STARTED]`
	 */
	public assertState(
		expected: ReadyState[] = [ReadyState.STARTED],
	): void {
		this.state.assertState(expected);
	}

	/**
	 *  Skip from `READY` to `STARTED`.
	 */
	public skart(startingError?: Error): void {
		this.state.skart(startingError);
	}

	/**
	 *  - If it's `READY` when invoked, then
	 *  	1. Start.
	 *  	1. Return the promise of the `STARTING` process.
	 *  - Otherwise,
	 *  	1. Return the promise of the `STARTING` process.
	 *  @throws ReferenceError
	 *  @decorator `@catchThrow()`
	 */
	@catchThrow()
	public async start(onStopping?: OnStopping): Promise<void> {
		await this.state.start(onStopping);
	}

	/**
	 *  - If it's `READY` when invoked, then
	 *  	1. Skip to `STOPPED`.
	 *  - If it's `STARTING` when invoked, then
	 *  	1. Wait until `STARTED`.
	 *  	1. Stop.
	 *  	1. Return the promise of `STOPPING` process.
	 *  - If it's `STARTED` when invoked, then
	 *  	1. Stop.
	 *  	1. Return the promise of `STOPPING` process.
	 *  - If it's `STOPPING` or `STOPPED` when invoked, then
	 *  	1. Return the promise of `STOPPING` process.
	 *
	 *  @decorator `@boundMethod`
	 *  @decorator `@catchThrow()`
	 */
	@catchThrow()
	@boundMethod
	public stop(err?: Error): Promise<void> {
		return this.state.stop(err);
	}

	/**
	 *  @throws ReferenceError
	 */
	public getRunning(): Promise<void> {
		return this.state.getRunning();
	}
}



export class Agent implements AgentLike {
	public getState: () => State;
	public setState: (newState: State) => void;
	public asyncRawStart: AsyncRawStart;
	public asyncRawStop: AsyncRawStop;

	public constructor(
		private target: Startable,
		options: {
			getState: () => State,
			setState: (newState: State) => void,
			asyncRawStart: AsyncRawStart,
			asyncRawStop: AsyncRawStop,
		},
	) {
		({
			getState: this.getState,
			setState: this.setState,
			asyncRawStart: this.asyncRawStart,
			asyncRawStop: this.asyncRawStop,
		} = options);
	}

	public getReadyState(): ReadyState {
		return this.target.getReadyState();
	}

	public assertState(expected: ReadyState[]): void {
		this.target.assertState(expected);
	}

	public skart(startingError?: Error): void {
		this.target.skart(startingError);
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.target.start(onStopping);
	}

	public async stop(err?: Error): Promise<void> {
		await this.target.stop(err);
	}

	public getRunning(): Promise<void> {
		return this.target.getRunning();
	}
}
