import { EventEmitter } from 'events';

const enum ReadyState {
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
    public readyState = ReadyState.STOPPED;
    private onStoppings: OnStopping[] = [];
    protected starp = (err?: Error) => void this
        .start()
        .finally(() => this.stop(err))
        .catch(() => { });

    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;

    private _starting = Promise.resolve();
    public async start(onStopping?: OnStopping): Promise<void> {
        if (this.readyState === ReadyState.STOPPED) {
            this.readyState = ReadyState.STARTING;
            this.onStoppings = [];
            this._starting = this._start()
                .finally(() => {
                    this.readyState = ReadyState.STARTED;
                });
        }
        if (onStopping) this.onStoppings.push(onStopping);
        // in case _start() calls start() syncly
        return Promise.resolve().then(() => this._starting);
    }

    private _stopping = Promise.resolve();
    public async stop(err?: Error): Promise<void> {
        if (this.readyState === ReadyState.STARTED) {
            this.readyState = ReadyState.STOPPING;
            for (const onStopping of this.onStoppings) onStopping(err);
            this._stopping = this._stop(err)
                .finally(() => {
                    this.readyState = ReadyState.STOPPED;
                });
        }
        // in case _stop() or onStopping() calls stop() syncly
        return Promise.resolve().then(() => this._stopping);
    }
}

export {
    Startable,
    StartableLike,
    ReadyState,
    OnStopping,
};
