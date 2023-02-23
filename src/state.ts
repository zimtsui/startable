import assert = require("assert");
import { StartableLike, ReadyState, OnStopping, RawStart, RawStop, StateError } from "./startable-like";


export abstract class State implements StartableLike {
	public abstract getReadyState(): ReadyState;
	public abstract skart(startingError?: Error): void;
	public abstract start(onStopping?: OnStopping): Promise<void>;
	public abstract stop(err?: Error): Promise<void>;
	public abstract activate(): void;
	public abstract getRunning(): Promise<void>;

	protected abstract agent: AgentLike;

	public assertState(expected: ReadyState[]): void {
		assert(
			expected.includes(this.getReadyState()),
			new StateError(this.getReadyState(), expected),
		);
	}
}

export interface AgentLike extends StartableLike {
	setState(newState: State): void;
	getState(): State;
	readonly rawStart: RawStart;
	readonly rawStop: RawStop;
}
