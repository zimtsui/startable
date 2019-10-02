declare enum LifePeriod {
    CONSTRUCTED = 0,
    STARTING = 1,
    FAILED = 2,
    STARTED = 3,
    STOPPING = 4,
    STOPPED = 5
}
interface Stopping {
    (err?: Error): void;
}
declare abstract class Autonomous {
    lifePeriod: LifePeriod;
    private _stopping;
    protected abstract _start(): Promise<void>;
    protected abstract _stop(): Promise<void>;
    protected reusable: boolean;
    private _started;
    start(stopping?: Stopping): Promise<void>;
    private _stopped;
    stop(arg?: Error | number): Promise<void>;
}
export default Autonomous;
export { Autonomous, LifePeriod, Stopping, };
