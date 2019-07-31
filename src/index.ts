import assert from 'assert';
import Bluebird from 'bluebird';

enum LifePeriod {
    CONSTRUCTED,
    STARTING,
    FAILED,
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

    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;
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
        return Bluebird.resolve(this._started)
            .then(() => {
                this.lifePeriod = LifePeriod.STARTED;
            }).tapCatch((err: Error) => {
                this.lifePeriod = LifePeriod.FAILED;
                return this.stop(err);
            });
    }

    private _stopped!: Promise<void>;
    stop(err?: Error): Promise<void> {
        if (this.lifePeriod === LifePeriod.STOPPED)
            return Promise.resolve();
        if (this.lifePeriod === LifePeriod.STOPPING)
            return this._stopped!;
        if (this.lifePeriod === LifePeriod.STARTING)
            return this._started!
                .then(() => this.stop())
                .catch((err: Error) => this.stop(err));

        this.lifePeriod = LifePeriod.STOPPING;
        this._stopping(err);

        this._stopped = this._stop(err);
        return this._stopped
            .then(() => {
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