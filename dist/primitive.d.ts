declare const enum LifePeriod {
    CONSTRUCTED = 0,
    STARTING = 1,
    STARTED = 2,
    FAILED = 3,
    STOPPING = 4,
    STOPPED = 5,
    BROKEN = 6
}
interface StartableLike {
    start(stopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
}
interface OnStopping {
    (err?: Error): void;
}
declare abstract class PrimitiveStartable implements StartableLike {
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
