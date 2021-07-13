/// <reference types="node" />
import { EventEmitter } from 'events';
declare const enum LifePeriod {
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
    lifePeriod: LifePeriod;
    private onStoppings;
    protected starp: (err?: Error | undefined) => undefined;
    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;
    private _starting;
    start(onStopping?: OnStopping): Promise<void>;
    private _stopping;
    stop(err?: Error): Promise<void>;
}
export { Startable, StartableLike, LifePeriod, OnStopping, };
