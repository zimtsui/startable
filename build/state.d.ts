import { StartableLike, ReadyState, OnStopping, RawStart, RawStop } from "./startable-like";
export declare abstract class State implements StartableLike {
    abstract getReadyState(): ReadyState;
    abstract skart(startingError?: Error): void;
    abstract start(onStopping?: OnStopping): Promise<void>;
    abstract stop(err?: Error): Promise<void>;
    abstract activate(): void;
    abstract getRunning(): Promise<void>;
    protected abstract agent: AgentLike;
    assertState(expected: ReadyState[]): void;
}
export interface AgentLike extends StartableLike {
    setState(newState: State): void;
    getState(): State;
    readonly rawStart: RawStart;
    readonly rawStop: RawStop;
}
