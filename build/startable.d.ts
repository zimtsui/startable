import { EventEmitter } from 'events';
declare const enum ReadyState {
    STARTING = "STARTING",
    STARTED = "STARTED",
    STOPPING = "STOPPING",
    STOPPED = "STOPPED"
}
interface StartableLike {
    start(stopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
}
interface OnStopping {
    (err?: Error): void;
}
declare abstract class Startable extends EventEmitter implements StartableLike {
    readyState: ReadyState;
    private onStoppings;
    private errStopDuringStarting;
    hasNotBeenStopping(onStopping?: OnStopping): Promise<void>;
    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;
    private _starting;
    start(onStopping?: OnStopping): Promise<void>;
    private _stopping;
    stop: (err?: Error | undefined) => Promise<void>;
}
export { Startable, StartableLike, ReadyState, OnStopping, };
