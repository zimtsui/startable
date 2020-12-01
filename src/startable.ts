import { EventEmitter } from 'events';

const enum LifePeriod {
    CONSTRUCTED = 'CONSTRUCTED',
    STARTING = 'STARTING',
    STARTED = 'STARTED',
    FAILED = 'FAILED',
    STOPPING = 'STOPPING',
    STOPPED = 'STOPPED',
    BROKEN = 'BROKEN',
}

interface StartableLike {
    start(stopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
}

interface OnStopping {
    (err?: Error): void;
}

class Illegal extends Error { }

abstract class Startable extends EventEmitter implements StartableLike {
    public lifePeriod: LifePeriod = LifePeriod.CONSTRUCTED;
    private onStopping?: OnStopping;

    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;

    public started?: Promise<void>;
    public async start(onStopping?: OnStopping): Promise<void> {
        if (
            this.lifePeriod === LifePeriod.CONSTRUCTED ||
            this.lifePeriod === LifePeriod.STOPPED
        ) {
            this.lifePeriod = LifePeriod.STARTING;
            this.onStopping = onStopping;
            return this.started = this._start()
                .then(() => {
                    this.lifePeriod = LifePeriod.STARTED;
                }, (err: Error) => {
                    this.lifePeriod = LifePeriod.FAILED;
                    throw err;
                });
        }

        if (
            this.lifePeriod === LifePeriod.STARTING ||
            this.lifePeriod === LifePeriod.STARTED ||
            this.lifePeriod === LifePeriod.FAILED
        )
            // in case _start() calls start() syncly
            return Promise.resolve().then(() => this.started!);

        throw new Illegal(this.lifePeriod);
    }

    private stopped?: Promise<void>;
    public async stop(err?: Error): Promise<void> {
        if (this.lifePeriod === LifePeriod.CONSTRUCTED) {
            this.lifePeriod = LifePeriod.STOPPED;
            return this.stopped = Promise.resolve();
        }

        if (this.lifePeriod === LifePeriod.STARTING)
            throw new Illegal(this.lifePeriod);

        if (
            this.lifePeriod === LifePeriod.STARTED ||
            this.lifePeriod === LifePeriod.FAILED
        ) {
            this.lifePeriod = LifePeriod.STOPPING;
            if (this.onStopping) this.onStopping(err);
            return this.stopped = this._stop(err)
                .then(() => {
                    this.lifePeriod = LifePeriod.STOPPED;
                }, (err: Error) => {
                    this.lifePeriod = LifePeriod.BROKEN;
                    throw err;
                });
        }

        // in case _stop() or onStopping() calls stop() syncly
        return Promise.resolve().then(() => this.stopped);
    }
}

export {
    Startable as default,
    Startable,
    StartableLike,
    LifePeriod,
    OnStopping,
    Illegal,
};
