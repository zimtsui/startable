import {
	StartableLike,
	ReadyState,
	OnStopping,
} from './startable-like';
import { ManualPromise } from '@zimtsui/manual-promise';

export abstract class Startable
	extends ManualPromise<void>
	implements StartableLike {
	protected abstract state: State;
	protected abstract rawStart: RawStart;
	protected abstract rawStop: RawStop;

	public constructor() {
		super();
		this.catch(() => { });
	}

	public getReadyState(): ReadyState {
		return this.state.getReadyState();
	}

	public skipStart(onStopping?: OnStopping): void {
		this.state.skipStart(onStopping);
	}

	public start(onStopping?: OnStopping): Promise<void> {
		const p = this.state.start(onStopping);
		p.catch(() => { });
		return p;
	}

	public assart(onStopping?: OnStopping): Promise<void> {
		const p = this.state.assart(onStopping);
		p.catch(() => { });
		return p;
	}

	public stop(err?: Error): Promise<void> {
		const p = this.state.stop(err);
		p.catch(() => { });
		return p;
	}

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
}


export abstract class Friendly extends Startable {
	public abstract state: State;
	public abstract rawStart: RawStart;
	public abstract rawStop: RawStop;
	public abstract resolve: (value: void) => void;
	public abstract reject: (err: Error) => void;
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


export abstract class State implements StartableLike {
	protected abstract host: Startable;
	public abstract postActivate(): void;

	public abstract getReadyState(): ReadyState;
	public abstract skipStart(onStopping?: OnStopping): void;
	public abstract start(onStopping?: OnStopping): Promise<void>;
	public abstract assart(onStopping?: OnStopping): Promise<void>;
	public abstract stop(err?: Error): Promise<void>;
	public abstract starp(err?: Error): Promise<void>;
	public abstract getStarting(): Promise<void>;
	public abstract getStopping(): Promise<void>;
}
