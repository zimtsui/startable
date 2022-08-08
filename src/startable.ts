import {
	StartableLike,
	ReadyState,
	OnStopping,
} from './startable-like';

export abstract class Startable
	implements StartableLike {
	protected abstract state: State;
	protected abstract rawStart: RawStart;
	protected abstract rawStop: RawStop;

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
		return this.state.getStarting();
	}

	public getStopping() {
		return this.state.getStopping();
	}
}


export abstract class Friendly extends Startable {
	public abstract state: State;
	public abstract rawStart: RawStart;
	public abstract rawStop: RawStop;
}

export interface RawStart {
	(): Promise<void>;
}

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
