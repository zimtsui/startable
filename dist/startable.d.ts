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
    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;
    private _starting;
    get starting(): Promise<void>;
    set starting(v: Promise<void>);
    start(onStopping?: OnStopping): Promise<void>;
    private _stopping;
    get stopping(): Promise<void>;
    set stopping(v: Promise<void>);
    stop(err?: Error): Promise<void>;
}
export { Startable as default, Startable, StartableLike, LifePeriod, OnStopping, };
