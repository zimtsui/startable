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

    private starting = Promise.resolve();
    @boundMethod
    public async start(onStopping?: OnStopping): Promise<void> {
        if (this.lifePeriod === LifePeriod.STOPPED) {
            this.lifePeriod = LifePeriod.STARTING;
            this.onStopping = onStopping;
            return this.starting = this._start()
                .finally(() => {
                    this.lifePeriod = LifePeriod.STARTED;
                });
        }

        // in case _start() calls start() syncly
        return Promise.resolve().then(() => this.starting);
    }

    private stopping = Promise.resolve();
    @boundMethod
    public async stop(err?: Error): Promise<void> {
        if (this.lifePeriod === LifePeriod.STARTED) {
            this.lifePeriod = LifePeriod.STOPPING;
            if (this.onStopping) this.onStopping(err);
            return this.stopping = this._stop(err)
                .finally(() => {
                    this.lifePeriod = LifePeriod.STOPPED;
                });
        }

        // in case _stop() or onStopping() calls stop() syncly
        return Promise.resolve().then(() => this.stopping);
    }
}

export {
    Startable as default,
    Startable,
    StartableLike,
    LifePeriod,
    OnStopping,
};
