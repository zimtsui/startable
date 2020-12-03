import { EventEmitter } from 'events';
import { boundMethod } from 'autobind-decorator';

process.on('unhandledRejection', () => { });

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
    private onStopping?: OnStopping;

    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;

    private _starting = Promise.resolve();
    public get starting(): Promise<void> {
        // in case _start() calls start() syncly
        return Promise.resolve().then(() => this._starting);
    }

    @boundMethod
    public async start(onStopping?: OnStopping): Promise<void> {
        if (this.lifePeriod === LifePeriod.STOPPED) {
            this.lifePeriod = LifePeriod.STARTING;
            this.onStopping = onStopping;
            return this._starting = this._start()
                .finally(() => {
                    this.lifePeriod = LifePeriod.STARTED;
                });
        } else await this.stopping.catch(() => { });
        return this.starting;
    }

    private _stopping = Promise.resolve();
    public get stopping(): Promise<void> {
        // in case _stop() or onStopping() calls stop() syncly
        return Promise.resolve().then(() => this._stopping);
    }

    @boundMethod
    public async stop(err?: Error): Promise<void> {
        if (this.lifePeriod === LifePeriod.STARTED) {
            this.lifePeriod = LifePeriod.STOPPING;
            if (this.onStopping) this.onStopping(err);
            return this._stopping = this._stop(err)
                .finally(() => {
                    this.lifePeriod = LifePeriod.STOPPED;
                });
        } else await this.starting.catch(() => { });
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
