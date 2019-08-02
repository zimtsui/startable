import assert from 'assert';
import Bluebird from 'bluebird';
import { boundMethod } from 'autobind-decorator';

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
    private _stopping!: Stopping;

    protected abstract _start(): Promise<void>;
    protected abstract _stop(): Promise<void>;
    protected _reusable = false;

    private _started!: Promise<void>;
    @boundMethod
    start(stopping: Stopping = () => { }): Promise<void> {
        assert(
            this.lifePeriod === LifePeriod.CONSTRUCTED
            || this._reusable && this.lifePeriod === LifePeriod.STOPPED,
        );
        this.lifePeriod = LifePeriod.STARTING;

        this._stopping = stopping;

        this._started = Bluebird.resolve(this._start())
            .then(() => {
                this.lifePeriod = LifePeriod.STARTED;
            }).tapCatch(() => {
                this.lifePeriod = LifePeriod.FAILED;
            });
        return Bluebird.resolve(this._started)
            .tapCatch(this.stop);
    }

    private _stopped!: Promise<void>;
    @boundMethod
    stop(err?: Error): Promise<void> {
        assert(this.lifePeriod !== LifePeriod.CONSTRUCTED);
        if (this.lifePeriod === LifePeriod.STOPPED)
            return Promise.resolve();
        if (this.lifePeriod === LifePeriod.STOPPING)
            return this._stopped!;
        if (this.lifePeriod === LifePeriod.STARTING)
            return this._started!
                .then(() => this.stop())
                .catch(this.stop);
        this.lifePeriod = LifePeriod.STOPPING;

        this._stopping(err);

        return this._stopped = this._stop()
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