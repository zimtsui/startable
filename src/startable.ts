import { EventEmitter } from 'events';

const enum LifePeriod {
    STARTING = 'STARTING',
    STARTED = 'STARTED',
    STOPPING = 'STOPPING',
    STOPPED = 'STOPPED',
}

interface StartableLike {
    start(stopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
}

interface OnStopping {
    (err?: Error): void;
}

abstract class Startable extends EventEmitter implements StartableLike {
    public lifePeriod = LifePeriod.STOPPED;
    private onStoppings: OnStopping[] = [];
    protected starp = (err?: Error) => void this
        .start()
        .finally(() => this.stop(err))
        .catch(() => { });

    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;

    private _starting = Promise.resolve();
    public async start(onStopping?: OnStopping): Promise<void> {
        if (this.lifePeriod === LifePeriod.STOPPED) {
            this.lifePeriod = LifePeriod.STARTING;
            this.onStoppings = [];
            this._starting = this._start()
                .finally(() => {
                    this.lifePeriod = LifePeriod.STARTED;
                });
        }
        if (onStopping) this.onStoppings.push(onStopping);
        // in case _start() calls start() syncly
        return Promise.resolve().then(() => this._starting);
    }

    private _stopping = Promise.resolve();
    public async stop(err?: Error): Promise<void> {
        if (this.lifePeriod === LifePeriod.STARTED) {
            this.lifePeriod = LifePeriod.STOPPING;
            for (const onStopping of this.onStoppings) onStopping(err);
            this._stopping = this._stop(err)
                .finally(() => {
                    this.lifePeriod = LifePeriod.STOPPED;
                });
        }
        // in case _stop() or onStopping() calls stop() syncly
        return Promise.resolve().then(() => this._stopping);
    }
}

export {
    Startable,
    StartableLike,
    LifePeriod,
    OnStopping,
};
