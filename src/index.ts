import assert from 'assert';

enum LifePeriod {
    CONSTRUCTED,
    STARTING,
    STARTED,
    STOPPING,
    STOPPED,
}

interface Stopping {
    (err?: Error): void
}

abstract class Autonomous {
    lifePeriod: LifePeriod = LifePeriod.CONSTRUCTED;
    private _stopping: Stopping = () => { };

    abstract _start(): Promise<void>;
    abstract _stop(err?: Error): Promise<void>;
    protected _reusable = false;

    private _started!: Promise<void>;
    start(stopping?: Stopping): Promise<void> {
        assert(
            this.lifePeriod === LifePeriod.CONSTRUCTED
            || this._reusable && this.lifePeriod === LifePeriod.STOPPED,
        );
        this.lifePeriod = LifePeriod.STARTING;

        if (stopping) this._stopping = stopping;

        this._started = this._start();
        return this._started
            .then(() => {
                this.lifePeriod = LifePeriod.STARTED;
            }).catch(err =>
                this.stop()
                    .then(() => Promise.reject(err)));
    }

    private _stopped: Promise<void> | undefined;
    stop(err?: Error): Promise<void> {
        if (this.lifePeriod === LifePeriod.STOPPING)
            return this._stopped!;
        if (this.lifePeriod === LifePeriod.STARTING)
            return this._started!
                .then(() => void this.stop())
                .catch(() => void this.stop());

        this.lifePeriod = LifePeriod.STOPPING;
        this._stopping(err);

        this._stopped = Promise.resolve(this._stop(err));
        return this._stopped.then(() => {
            this.lifePeriod = LifePeriod.STOPPED;
        });
    }
}

export default Autonomous;
export {
    Autonomous,
    LifePeriod,
    Stopping,
};