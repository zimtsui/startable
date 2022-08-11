import { ManualPromise } from '@zimtsui/manual-promise';
import { boundMethod } from 'autobind-decorator';
import { catchThrow } from './catch-throw';


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
		states: ReadyState[] = [ReadyState.STARTED],
	): void {
		for (const state of states)
			if (this.getReadyState() === state)
				return;
		throw new IncorrectState(action, this.getReadyState());
	}

	/**
	 * Skip from READY to STARTED.
	 * @decorator `@boundMethod`
	 */
	@boundMethod
	public skart(onStopping?: OnStopping): void {
		this.state.skart(onStopping);
	}

	/**
	 * - If it's READY now, then
	 * 1. Start.
	 * 1. Wait until STARTED.
	 * - If it's STARTING or STARTED now, then
	 * 1. Wait until STARTED.
	 * @decorator `@boundMethod`
	 * @decorator `@catchThrow()`
	 */
	@boundMethod
	@catchThrow()
	public async start(onStopping?: OnStopping): Promise<void> {
		return await this.state.start(onStopping);
	}

	/**
	 * 1. Assert it's STARTING or STARTED now.
	 * 1. Wait until STARTED.
	 * @decorator `@boundMethod`
	 * @decorator `@catchThrow()`
	 */
	@boundMethod
	@catchThrow()
	public async assart(onStopping?: OnStopping): Promise<void> {
		return await this.state.assart(onStopping);
	}

	/**
	 * - If it's STARTED now, then
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
	public async starp(err?: Error): Promise<void> {
		return await this.state.starp(err);
	}

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
	public abstract skart(onStopping?: OnStopping): void;
	public abstract start(onStopping?: OnStopping): Promise<void>;
	public abstract assart(onStopping?: OnStopping): Promise<void>;
	public abstract stop(err?: Error): Promise<void>;
	public abstract starp(err?: Error): Promise<void>;
	public abstract getRunningPromise(): PromiseLike<void>;
}

export class IncorrectState extends Error {
	public constructor(
		action: string,
		state: ReadyState,
	) {
		super(`Cannot ${action} during ${state}.`);
	}
}
