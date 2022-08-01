import {
	StartableLike,
	ReadyState,
	OnStopping,
} from './startable-like';

export abstract class Startable<StartArgs extends unknown[]>
	implements StartableLike<StartArgs> {
	protected abstract state: State<StartArgs>;
	protected abstract rawStart: RawStart<StartArgs>;
	protected abstract rawStop: RawStop;

	public getReadyState = (): ReadyState => {
		return this.state.getReadyState();
	}

	public skipStart = (onStopping?: OnStopping): void => {
		this.state.skipStart(onStopping);
	}

	public start = async (
		startArgs: StartArgs,
		onStopping?: OnStopping,
	): Promise<void> => {
		await this.state.start(startArgs, onStopping);
	}

	public assart = async (onStopping?: OnStopping): Promise<void> => {
		await this.state.assart(onStopping);
	}

	public stop = (err?: Error): Promise<void> => {
		const promise = this.state.stop(err);
		promise.catch(() => { });
		return promise;
	}

	public starp = (err?: Error): Promise<void> => {
		const promise = this.state.starp(err);
		promise.catch(() => { });
		return promise;
	}
}


export abstract class Friendly<StartArgs extends unknown[]> extends Startable<StartArgs> {
	public abstract state: State<StartArgs>;
	public abstract rawStart: RawStart<StartArgs>;
	public abstract rawStop: RawStop;
}

export interface RawStart<StartArgs extends unknown[]> {
	(...args: StartArgs): Promise<void>;
}

export interface RawStop {
	(err?: Error): Promise<void>;
}


export abstract class State<StartArgs extends unknown[]> {
	protected abstract host: Startable<StartArgs>;
	public abstract postActivate(): void;

	public abstract getReadyState(): ReadyState;
	public abstract skipStart(onStopping?: OnStopping): void;
	public abstract start(
		startArgs: StartArgs,
		onStopping?: OnStopping): Promise<void>;
	public abstract assart(onStopping?: OnStopping): Promise<void>;
	public abstract stop(err?: Error): Promise<void>;
	public abstract starp(err?: Error): Promise<void>;
}
