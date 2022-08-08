import { PublicManualPromise } from '@zimtsui/manual-promise';
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
	 * Skip from READY to STARTED.
	 * @decorator `@boundMethod`
	 */
	@boundMethod
	public skipStart(onStopping?: OnStopping): void {
		this.state.skipStart(onStopping);
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
	 * If it's STARTING now, then
	 * 1. Wait until STARTED.
	 * 1. Stop.
	 * @decorator `@boundMethod`
	 * @decorator `@catchThrow()`
	 */
	@boundMethod
	@catchThrow()
	public async starp(err?: Error): Promise<void> {
		return await this.state.starp(err);
	}

	/**
	 * @decorator `@catchThrow()`
	 */
	@catchThrow()
	public getStarting() {
		return this.state.getStarting();
	}

	/**
	 * @decorator `@catchThrow()`
	 */
	@catchThrow()
	public getStopping() {
		return this.state.getStopping();
	}

	/**
	 * @decorator `@catchThrow()`
	 */
	@catchThrow()
	public getPromise(): Promise<void> {
		return this.state.getPromise();
	}
}


export abstract class Friendly extends Startable {
	public abstract state: State;
	public abstract rawStart: RawStart;
	public abstract rawStop: RawStop;
	public abstract promise: PublicManualPromise<void>;
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
	protected abstract promise: PublicManualPromise<void>;

	public abstract postActivate(): void;
	public abstract getReadyState(): ReadyState;
	public abstract skipStart(onStopping?: OnStopping): void;
	public abstract start(onStopping?: OnStopping): Promise<void>;
	public abstract assart(onStopping?: OnStopping): Promise<void>;
	public abstract stop(err?: Error): Promise<void>;
	public abstract starp(err?: Error): Promise<void>;
	public abstract getStarting(): Promise<void>;
	public abstract getStopping(): Promise<void>;
	public getPromise(): Promise<void> {
		return this.promise;
	}
}
