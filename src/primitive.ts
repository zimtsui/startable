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
    start(stopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
}

interface OnStopping {
    (err?: Error): void;
}

abstract class PrimitiveStartable implements StartableLike {
    public lifePeriod: LifePeriod = LifePeriod.CONSTRUCTED;
    private onStopping?: OnStopping;

    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;

    public started?: Promise<void>;
    public async start(stopping?: OnStopping): Promise<void> {
        assert(
            this.lifePeriod === LifePeriod.CONSTRUCTED
            || this.lifePeriod === LifePeriod.STOPPED,
        );
        this.lifePeriod = LifePeriod.STARTING;

        this.onStopping = stopping;

        return this.started = this._start()
            .then(() => {
                this.lifePeriod = LifePeriod.STARTED;
            }, (err: Error) => {
                this.lifePeriod = LifePeriod.FAILED;
                throw err;
            });
    }

    public stopped?: Promise<void>;
    public async stop(err?: Error): Promise<void> {
        if (this.lifePeriod === LifePeriod.CONSTRUCTED) {
            this.lifePeriod = LifePeriod.STOPPED;
            this.stopped = Promise.resolve();
            return;
        }
        if (
            this.lifePeriod === LifePeriod.STOPPING ||
            this.lifePeriod === LifePeriod.STOPPED ||
            this.lifePeriod === LifePeriod.BROKEN
        ) return Promise.resolve()
            // in case _stop() calls stop() syncly
            .then(() => this.stopped);
        if (this.lifePeriod === LifePeriod.STARTING)
            return Promise.resolve()
                // in case _start() calls stop() syncly
                .then(() => this.started)
                .catch(() => { })
                .then(() => this.stop(err));

        this.lifePeriod = LifePeriod.STOPPING;

        this.stopped = this._stop(err)
            .then(() => {
                this.lifePeriod = LifePeriod.STOPPED;
            }, (err: Error) => {
                this.lifePeriod = LifePeriod.BROKEN;
                throw err;
            });
        if (this.onStopping) this.onStopping(err);

        return this.stopped;
    }
}

export {
    PrimitiveStartable as default,
    PrimitiveStartable,
    StartableLike,
    LifePeriod,
    OnStopping,
};