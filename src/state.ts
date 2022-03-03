import {
	StateLike,
	FriendlyStartableLike,
} from './friendly-startable-like';
import {
	OnStopping,
	ReadyState,
} from './startable-like';


export abstract class State implements StateLike {
	constructor(
		protected readonly startable: FriendlyStartableLike,
	) { }

	public abstract tryStart(onStopping?: OnStopping): Promise<void>;
	public abstract tryStop(err?: Error): Promise<void>;
	public abstract fail(err: Error): Promise<void>;
	public abstract start(onStopping?: OnStopping): Promise<void>;
	public abstract stop(err?: Error): Promise<void>;
	public abstract getReadyState(): ReadyState;
	public abstract skipStart(onStopping?: OnStopping): void;
}

export class CannotFail extends Error { }
export class CannotSkipStart extends Error { }
