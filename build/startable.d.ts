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
export declare class StopDuringStarting extends Error {
}
export declare abstract class Startable extends EventEmitter implements StartableLike {
    readyState: ReadyState;
    private _onStoppings;
    private _stopErrorDuringStarting?;
    private _resolve?;
    private _reject?;
    assart(onStopping?: OnStopping): Promise<void>;
    protected abstract _start(): Promise<void>;
    private _starting;
    start(onStopping?: OnStopping): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;
    private _stopping;
    stop: (err?: Error | undefined) => Promise<void>;
}
