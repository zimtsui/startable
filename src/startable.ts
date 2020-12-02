import { EventEmitter } from 'events';

const enum LifePeriod {
    STARTING = 'STARTING',
    STARTED = 'STARTED',
    NSTARTED = 'NSTARTED',
    STOPPING = 'STOPPING',
    STOPPED = 'STOPPED',
    NSTOPPED = 'NSTOPPED',
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
    public lifePeriod: LifePeriod = LifePeriod.STOPPED;
    private onStopping?: OnStopping;

    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;

    protected started = Promise.resolve();
    public async start(onStopping?: OnStopping): Promise<void> {
        if (
            this.lifePeriod === LifePeriod.STOPPED ||
            this.lifePeriod === LifePeriod.NSTOPPED
        ) {
            this.lifePeriod = LifePeriod.STARTING;
            this.onStopping = onStopping;
            return this.started = this._start()
                .then(() => {
                    this.lifePeriod = LifePeriod.STARTED;
                }, (err: Error) => {
                    this.lifePeriod = LifePeriod.NSTARTED;
                    throw err;
                });
        }

        if (
            this.lifePeriod === LifePeriod.STARTING ||
            this.lifePeriod === LifePeriod.STARTED ||
            this.lifePeriod === LifePeriod.NSTARTED
        )
            // in case _start() calls start() syncly
            return Promise.resolve().then(() => this.started!);

        throw new Illegal(this.lifePeriod);
    }

    protected stopped = Promise.resolve();
    public async stop(err?: Error): Promise<void> {
        if (this.lifePeriod === LifePeriod.STARTING)
            throw new Illegal(this.lifePeriod);

        if (
            this.lifePeriod === LifePeriod.STARTED ||
            this.lifePeriod === LifePeriod.NSTARTED
        ) {
            this.lifePeriod = LifePeriod.STOPPING;
            if (this.onStopping) this.onStopping(err);
            return this.stopped = this._stop(err)
                .then(() => {
                    this.lifePeriod = LifePeriod.STOPPED;
                }, (err: Error) => {
                    this.lifePeriod = LifePeriod.NSTOPPED;
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
