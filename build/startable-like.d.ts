import { AssertionError } from "assert";
export declare enum ReadyState {
    READY = "READY",
    STARTING = "STARTING",
    STARTED = "STARTED",
    STOPPING = "STOPPING",
    STOPPED = "STOPPED"
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
export declare class StateError extends AssertionError {
    constructor(actual: ReadyState, expected?: ReadyState[]);
}
export interface StartableLike {
    getReadyState(): ReadyState;
    skart(startingError?: Error): void;
    start(onStopping?: OnStopping): PromiseLike<void>;
    stop(err?: Error): Promise<void>;
}