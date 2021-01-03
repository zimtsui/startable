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
    public lifePeriod: LifePeriod = LifePeriod.STOPPED;
    private onStoppings: OnStopping[] = [];

    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;

    private _starting = Promise.resolve();
    public get starting(): Promise<void> {
        // in case _start() calls start() syncly
        return Promise.resolve().then(() => this._starting);
    }
    public set starting(v: Promise<void>) {
        this._starting = v;
    }

    public async start(onStopping?: OnStopping): Promise<void> {
        if (this.lifePeriod === LifePeriod.STOPPING)
            await this.stopping.catch(() => { });

        if (this.lifePeriod === LifePeriod.STOPPED) {
            this.lifePeriod = LifePeriod.STARTING;
            this.onStoppings = [];
            this.starting = this._start()
                .finally(() => {
                    this.lifePeriod = LifePeriod.STARTED;
                });
        }
        if (onStopping) this.onStoppings.push(onStopping);
        return this.starting;
    }

    private _stopping = Promise.resolve();
    public get stopping(): Promise<void> {
        // in case _stop() or onStopping() calls stop() syncly
        return Promise.resolve().then(() => this._stopping);
    }
    public set stopping(v: Promise<void>) {
        this._stopping = v;
    }

    public async stop(err?: Error): Promise<void> {
        if (this.lifePeriod === LifePeriod.STARTING)
            await this.starting.catch(() => { });
        if (this.lifePeriod === LifePeriod.STARTED) {
            this.lifePeriod = LifePeriod.STOPPING;
            for (const onStopping of this.onStoppings) onStopping(err);
            this.stopping = this._stop(err)
                .finally(() => {
                    this.lifePeriod = LifePeriod.STOPPED;
                });
        }
        return this.stopping;
    }
}

export {
    Startable as default,
    Startable,
    StartableLike,
    LifePeriod,
    OnStopping,
};
