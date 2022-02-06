export declare const enum ReadyState {
    STARTING = "STARTING",
    STARTED = "STARTED",
    UNSTARTED = "UNSTARTED",
    STOPPING = "STOPPING",
    STOPPED = "STOPPED",
    UNSTOPPED = "UNSTOPPED"
}
export interface StartableLike {
    start(stopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
}
export interface OnStopping {
    (err?: Error): void;
}
export declare class StopCalledDuringStarting extends Error {
    constructor();
}
export declare class StartingFailedManually extends Error {
    constructor();
}
