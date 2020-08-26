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
    start(stopping?: Stopping): Promise<void>;
    stop(err?: Error): Promise<void>;
}
interface Stopping {
    (err?: Error): void;
}
declare abstract class Startable implements StartableLike {
    lifePeriod: LifePeriod;
    private stopping?;
    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;
    protected reusable: boolean;
    started: Promise<void>;
    start(stopping?: Stopping): Promise<void>;
    stopped: Promise<void>;
    stop(err?: Error): Promise<void>;
}
export { Startable as default, Startable, StartableLike, LifePeriod, Stopping, };
