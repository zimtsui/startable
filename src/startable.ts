import { PublicManualPromise } from '@zimtsui/manual-promise';
import { boundMethod } from 'autobind-decorator';


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

	@boundMethod
	public skipStart(onStopping?: OnStopping): void {
		this.state.skipStart(onStopping);
	}

	@boundMethod
	public start(onStopping?: OnStopping): Promise<void> {
		const p = this.state.start(onStopping);
		p.catch(() => { });
		return p;
	}

	@boundMethod
	public assart(onStopping?: OnStopping): Promise<void> {
		const p = this.state.assart(onStopping);
		p.catch(() => { });
		return p;
	}

	@boundMethod
	public stop(err?: Error): Promise<void> {
		const p = this.state.stop(err);
		p.catch(() => { });
		return p;
	}

	@boundMethod
	public starp(err?: Error): Promise<void> {
		const p = this.state.starp(err);
		p.catch(() => { });
		return p;
	}

	public getStarting() {
		const p = this.state.getStarting();
		p.catch(() => { });
		return p;
	}

	public getStopping() {
		const p = this.state.getStopping();
		p.catch(() => { });
		return p;
	}

	public getPromise(): Promise<void> {
		const p = this.state.getPromise();
		p.catch(() => { });
		return p;
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
