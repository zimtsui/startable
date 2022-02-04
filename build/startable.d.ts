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
export declare class StartingFailedManually extends Error {
    constructor();
}
export declare abstract class Startable extends EventEmitter implements StartableLike {
    readyState: ReadyState;
    private Startable$onStoppings?;
    private Startable$startingIsFailedManually?;
    private Startable$resolve?;
    private Startable$reject?;
    assart(onStopping?: OnStopping): Promise<void>;
    protected abstract Startable$rawStart(): Promise<void>;
    private Startable$starting;
    start(onStopping?: OnStopping): Promise<void>;
    protected abstract Startable$rawStop(err?: Error): Promise<void>;
    private Startable$stopping;
    tryStop(err?: Error): Promise<void>;
    failStarting(): void;
    private Startable$stopUncaught;
    stop(err?: Error): Promise<void>;
}
