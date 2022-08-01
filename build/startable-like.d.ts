export interface UnboundStartableLike<StartArgs extends unknown[]> {
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
    start(args: StartArgs, onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getStarting(): Promise<void>;
    getStopping(): Promise<void>;
}
export interface StartableLike<StartArgs extends unknown[]> extends UnboundStartableLike<StartArgs> {
    getReadyState: () => ReadyState;
    skipStart: (onStopping?: OnStopping) => void;
    start: (args: StartArgs, onStopping?: OnStopping) => Promise<void>;
    assart: (onStopping?: OnStopping) => Promise<void>;
    stop: (err?: Error) => Promise<void>;
    starp: (err?: Error) => Promise<void>;
    getStarting: () => Promise<void>;
    getStopping: () => Promise<void>;
}
export declare const enum ReadyState {
    STARTING = "STARTING",
    STARTED = "STARTED",
    STOPPING = "STOPPING",
    STOPPED = "STOPPED"
}
export interface OnStopping {
    (err?: Error): void;
}
