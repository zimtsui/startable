import { StartableLike } from './startable-like';

export abstract class Startable implements StartableLike {
	protected abstract state: State;
	protected abstract rawStart: RawStart;
	protected abstract rawStop: RawStop;

	public getReadyState = (): ReadyState => {
		return this.state.getReadyState();
	}

	public skipStart = (onStopping?: OnStopping): void => {
		this.state.skipStart(onStopping);
	}

	public start = async (onStopping?: OnStopping): Promise<void> => {
		await this.state.start(onStopping);
	}

	public assart = async (onStopping?: OnStopping): Promise<void> => {
		await this.state.assart(onStopping);
	}

	public stop = async (err?: Error): Promise<void> => {
		await this.state.stop(err);
	}

	public starp = (err?: Error): Promise<void> => {
		const promise = this.state.starp(err);
		promise.catch(() => { });
		return promise;
	}
}


export abstract class Friendly extends Startable {
	public abstract state: State;
	public abstract rawStart: RawStart;
	public abstract rawStop: RawStop;
}


export const enum ReadyState {
	STARTING = 'STARTING',
	STARTED = 'STARTED',
	STOPPING = 'STOPPING',
	STOPPED = 'STOPPED',
}

export interface OnStopping {
	(err?: Error): void;
}

export interface RawStart {
	(): Promise<void>;
}

export interface RawStop {
	(err?: Error): Promise<void>;
}


export abstract class State {
	protected abstract host: Startable;
	public abstract postActivate(): void;

	public abstract getReadyState(): ReadyState;
	public abstract skipStart(onStopping?: OnStopping): void;
	public abstract start(onStopping?: OnStopping): Promise<void>;
	public abstract assart(onStopping?: OnStopping): Promise<void>;
	public abstract stop(err?: Error): Promise<void>;
	public abstract starp(err?: Error): Promise<void>;
}
