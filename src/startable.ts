import { boundMethod } from 'autobind-decorator';
import { catchThrow } from './catch-throw';
import { AssertionError } from 'assert';


export const enum ReadyState {
	READY = 'READY',
	STARTING = 'STARTING',
	STARTED = 'STARTED',
	STOPPING = 'STOPPING',
	STOPPED = 'STOPPED',
}

export interface OnStopping {
	(err?: Error): void;
}

export abstract class Startable {
	protected abstract state: State;
	protected abstract rawStart: RawStart;
	protected abstract rawStop: RawStop;

	public getReadyState(): ReadyState {
		return this.state.getReadyState();
	}

	/**
	 * @throws IncorrectState
	 */
	public assertReadyState(
		action: string,
		expected: ReadyState[] = [ReadyState.STARTED],
	): void {
		for (const state of expected)
			if (this.getReadyState() === state)
				return;
		throw new StateError(
			action,
			this.getReadyState(),
			expected,
		);
	}

	/**
	 * Skip from READY to STARTED.
	 * @decorator `@boundMethod`
	 */
	@boundMethod
	public skart(err?: Error): void {
		this.state.skart(err);
	}

	/**
	 * - If it's READY now, then
	 * 1. Start.
	 * 1. Wait until STARTED.
	 * - If it's STARTING or STARTED now, then
	 * 1. Wait until STARTED.
	 * @decorator `@boundMethod`
	 * @decorator `@catchThrow()`
	 * @throws ReferenceError
	 */
	@boundMethod
	@catchThrow()
	public start(onStopping?: OnStopping): PromiseLike<void> {
		return this.state.start(onStopping);
	}

	/**
	 * - If it's READY now, then
	 * 1. Skip to STOPPED.
	 * - If it's STARTING or STARTED now, then
	 * 1. Wait until STARTED.
	 * 1. Stop.
	 * 1. Wait until STOPPED.
	 * - If it's STOPPING or STOPPED now, then
	 * 1. Wait until STOPPED.
	 * @decorator `@boundMethod`
	 * @decorator `@catchThrow()`
	 */
	@boundMethod
	@catchThrow()
	public async stop(err?: Error): Promise<void> {
		return await this.state.stop(err);
	}

	/**
	 * @throws ReferenceError
	 */
	public getRunningPromise(): PromiseLike<void> {
		return this.state.getRunningPromise();
	}
}


export abstract class Friendly extends Startable {
	public abstract state: State;
	public abstract rawStart: RawStart;
	public abstract rawStop: RawStop;
}

/**
 * @throws Error
 */
export interface RawStart {
	(): Promise<void>;
}

/**
 * @throws Error
 */
export interface RawStop {
	(err?: Error): Promise<void>;
}


export abstract class State {
	protected abstract host: Startable;

	public abstract postActivate(): void;
	public abstract getReadyState(): ReadyState;
	public abstract start(onStopping?: OnStopping): PromiseLike<void>;
	public abstract skart(err?: Error): void;
	public abstract stop(err?: Error): Promise<void>;
	public abstract getRunningPromise(): PromiseLike<void>;
}

export class StateError extends AssertionError {
	public constructor(
		public action: string,
		actualState: ReadyState,
		expectedStates?: ReadyState[],
	) {
		super({
			expected: expectedStates,
			actual: actualState,
			operator: 'in',
		});
	}
}
