import assert from 'assert';
import { boundMethod } from 'autobind-decorator';
import Timer from 'timers';
import process from 'process';

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
    private _stopping!: Stopping | undefined;

    protected abstract _start(): Promise<void>;
    protected abstract _stop(): Promise<void>;
    protected reusable = false;

    private _started!: Promise<void>;
    @boundMethod
    async start(stopping?: Stopping): Promise<void> {
        assert(
            this.lifePeriod === LifePeriod.CONSTRUCTED
            || this.reusable && this.lifePeriod === LifePeriod.STOPPED,
        );
        this.lifePeriod = LifePeriod.STARTING;

        this._stopping = stopping;

        this._started = this._start()
            .then(() => {
                this.lifePeriod = LifePeriod.STARTED;
            }).catch(err => {
                this.lifePeriod = LifePeriod.FAILED;
                throw err;
            });
        return this._started
            .catch(async err => {
                await this.stop();
                throw err;
            });
    }

    private _stopped!: Promise<void>;
    @boundMethod
    async stop(arg?: Error | number): Promise<void> {
        assert(this.lifePeriod !== LifePeriod.CONSTRUCTED);
        if (this.lifePeriod === LifePeriod.STOPPED)
            return Promise.resolve();
        if (this.lifePeriod === LifePeriod.STOPPING)
            return this._stopped;
        if (this.lifePeriod === LifePeriod.STARTING)
            return this._started
                .then(() => this.stop())
                .catch(() => this.stop());
        this.lifePeriod = LifePeriod.STOPPING;

        if (arg instanceof Error)
            this._stopping && this._stopping(arg);
        if (typeof arg === 'number')
            Timer.setTimeout(() => process.exit(-1), arg).unref();

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