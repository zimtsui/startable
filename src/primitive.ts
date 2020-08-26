import chai from 'chai';
const { assert } = chai;

const enum LifePeriod {
    CONSTRUCTED,
    STARTING,
    STARTED,
    FAILED,
    STOPPING,
    STOPPED,
    BROKEN,
}

interface StartableLike {
    start(stopping?: Stopping): Promise<void>;
    stop(err?: Error): Promise<void>;
}

interface Stopping {
    (err?: Error): void;
}

abstract class PrimitiveStartable implements StartableLike {
    public lifePeriod: LifePeriod = LifePeriod.CONSTRUCTED;
    private stopping?: Stopping;

    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;

    public started!: Promise<void>;
    public async start(stopping?: Stopping): Promise<void> {
        assert(
            this.lifePeriod === LifePeriod.CONSTRUCTED
            || this.lifePeriod === LifePeriod.STOPPED,
        );
        this.lifePeriod = LifePeriod.STARTING;

        this.stopping = stopping;

        return this.started = this._start()
            .then(() => {
                this.lifePeriod = LifePeriod.STARTED;
            }, (err: Error) => {
                this.lifePeriod = LifePeriod.FAILED;
                throw err;
            });
    }

    public stopped!: Promise<void>;
    public async stop(err?: Error): Promise<void> {
        assert(this.lifePeriod !== LifePeriod.CONSTRUCTED);
        if (
            this.lifePeriod === LifePeriod.STOPPING ||
            this.lifePeriod === LifePeriod.STOPPED ||
            this.lifePeriod === LifePeriod.BROKEN
        ) return Promise.resolve()
            // prevent _stop() calling stop() syncly
            .then(() => this.stopped);
        if (this.lifePeriod === LifePeriod.STARTING)
            return Promise.resolve()
                // prevent _start() calling stop() syncly
                .then(() => this.started)
                .catch(() => { })
                .then(() => this.stop());

        this.lifePeriod = LifePeriod.STOPPING;

        this.stopped = this._stop(err)
            .then(() => {
                this.lifePeriod = LifePeriod.STOPPED;
            }, (err: Error) => {
                this.lifePeriod = LifePeriod.BROKEN;
                throw err;
            });
        if (this.stopping) this.stopping(err);

        return this.stopped;
    }
}

export {
    PrimitiveStartable as default,
    PrimitiveStartable,
    StartableLike,
    LifePeriod,
    Stopping,
};