import { EventEmitter } from 'events';
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
export declare abstract class Startable extends EventEmitter implements StartableLike {
    readyState: ReadyState;
    private Startable$onStoppings;
    private Startable$errorDuringStarting?;
    private Startable$resolve?;
    private Startable$reject?;
    assart(onStopping?: OnStopping): Promise<void>;
    protected abstract Startable$start(): Promise<void>;
    private Startable$starting;
    start(onStopping?: OnStopping): Promise<void>;
    protected abstract Startable$stop(err?: Error): Promise<void>;
    private Startable$stopping;
    stop: (err?: Error | undefined) => Promise<void>;
}
