import { boundMethod } from 'autobind-decorator';



export abstract class Startable {
	protected abstract state: State;
	protected abstract rawStart: RawStart;
	protected abstract rawStop: RawStop;

	@boundMethod
	public getReadyState(): ReadyState {
		return this.state.getReadyState();
	}

	@boundMethod
	public skipStart(onStopping?: OnStopping): void {
		this.state.skipStart(onStopping);
	}

	@boundMethod
	public async start(onStopping?: OnStopping): Promise<void> {
		await this.state.start(onStopping);
	}

	@boundMethod
	public async assart(onStopping?: OnStopping): Promise<void> {
		await this.state.assart(onStopping);
	}

	@boundMethod
	public async stop(err?: Error): Promise<void> {
		await this.state.stop(err);
	}

	@boundMethod
	public starp(err?: Error): Promise<void> {
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
