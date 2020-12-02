/// <reference types="node" />
import { EventEmitter } from 'events';
declare const enum LifePeriod {
    STARTING = "STARTING",
    STARTED = "STARTED",
    NSTARTED = "NSTARTED",
    STOPPING = "STOPPING",
    STOPPED = "STOPPED",
    NSTOPPED = "NSTOPPED"
}
interface StartableLike {
    start(stopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
}
interface OnStopping {
    (err?: Error): void;
}
declare class Illegal extends Error {
}
declare abstract class Startable extends EventEmitter implements StartableLike {
    lifePeriod: LifePeriod;
    private onStopping?;
    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;
    started: Promise<void>;
    start(onStopping?: OnStopping): Promise<void>;
    stopped: Promise<void>;
    stop(err?: Error): Promise<void>;
}
export { Startable as default, Startable, StartableLike, LifePeriod, OnStopping, Illegal, };
