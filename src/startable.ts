import { EventEmitter } from 'events';
import { assert } from 'chai';

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

class StopDuringStarting extends Error { }

abstract class Startable extends EventEmitter implements StartableLike {
    public readyState = ReadyState.STOPPED;
    private onStoppings: OnStopping[] = [];
    private errStopDuringStarting: null | Error = null;
    public assertStart(onStopping?: OnStopping): Promise<void> {
        assert(
            this.readyState === ReadyState.STARTING ||
            this.readyState === ReadyState.STARTED,
            'Not STARTING or STARTED.',
        );
        return this.start(onStopping);
    }


    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;

    private _starting = Promise.resolve();
    public async start(onStopping?: OnStopping): Promise<void> {
        if (this.readyState === ReadyState.STOPPED) {
            this.readyState = ReadyState.STARTING;
            this.errStopDuringStarting = null;
            this.onStoppings = [];
            this._starting = this._start()
                .finally(() => {
                    this.readyState = ReadyState.STARTED;
                }).then(result => {
                    if (this.errStopDuringStarting) throw this.errStopDuringStarting;
                    return result;
                });
            this._starting.catch(() => { });
        }
        if (onStopping) this.onStoppings.push(onStopping);
        // in case _start() calls start() syncly
        return Promise.resolve().then(() => this._starting);
    }

    private _stopping = Promise.resolve();
    public stop = (err?: Error): Promise<void> => {
        if (this.readyState === ReadyState.STARTING) {
            if (err) this.errStopDuringStarting = err;
            else this.errStopDuringStarting = new Error('start() stopped by stop() with no reason.');
            const stopping = this.start()
                .catch(() => { })
                .then(() => {
                    throw new StopDuringStarting('Stop during starting.');
                });;
            stopping.catch(() => { });
            return stopping;
        }
        if (this.readyState === ReadyState.STARTED) {
            this.readyState = ReadyState.STOPPING;
            for (const onStopping of this.onStoppings) onStopping(err);
            this._stopping = this._stop(err)
                .finally(() => {
                    this.readyState = ReadyState.STOPPED;
                });
            this._stopping.catch(() => { });
        }
        // in case _stop() or onStopping() calls stop() syncly
        const stopping = Promise.resolve().then(() => this._stopping);
        stopping.catch(() => { });
        return stopping;
    }
}

export {
    Startable,
    StartableLike,
    ReadyState,
    OnStopping,
    StopDuringStarting,
};
