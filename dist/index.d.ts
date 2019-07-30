declare enum LifePeriod {
    CONSTRUCTED = 0,
    STARTING = 1,
    STARTED = 2,
    STOPPING = 3,
    STOPPED = 4
}
interface Stopping {
    (err?: Error): void;
}
declare abstract class Autonomous {
    lifePeriod: LifePeriod;
    private _stopping;
    abstract _start(): Promise<void>;
    abstract _stop(err?: Error): Promise<void>;
    protected _reusable: boolean;
    private _started;
    start(stopping?: Stopping): Promise<void>;
    private _stopped;
    stop(err?: Error): Promise<void>;
}
export default Autonomous;
export { Autonomous, LifePeriod, Stopping, };
