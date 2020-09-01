import EventEmitter from 'eventemitter3';
declare const enum LifePeriod {
    CONSTRUCTED = "CONSTRUCTED",
    STARTING = "STARTING",
    STARTED = "STARTED",
    FAILED = "FAILED",
    STOPPING = "STOPPING",
    STOPPED = "STOPPED",
    BROKEN = "BROKEN"
}
interface StartableLike {
    start(stopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
}
interface OnStopping {
    (err?: Error): void;
}
declare abstract class PrimitiveStartable extends EventEmitter implements StartableLike {
    lifePeriod: LifePeriod;
    private onStopping?;
    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;
    started?: Promise<void>;
    start(stopping?: OnStopping): Promise<void>;
    stopped?: Promise<void>;
    stop(err?: Error): Promise<void>;
}
export { PrimitiveStartable as default, PrimitiveStartable, StartableLike, LifePeriod, OnStopping, };
