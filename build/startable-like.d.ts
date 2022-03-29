export interface StartableLike {
    tryStart(onStopping?: OnStopping): Promise<void>;
    tryStop(err?: Error): Promise<void>;
    fail(err: Error): Promise<void>;
    start(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
}
export declare const StartableLike: {};
export declare const enum ReadyState {
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
    (): Promise<void>;
}
export declare class CannotFail extends Error {
}
export declare class CannotSkipStart extends Error {
}
