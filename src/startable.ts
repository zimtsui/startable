import { EventEmitter } from 'events';
import { assert } from 'chai';

export const enum ReadyState {
    STARTING = 'STARTING',
    STARTED = 'STARTED',
    UNSTARTED = 'UNSTARTED',
    STOPPING = 'STOPPING',
    STOPPED = 'STOPPED',
    UNSTOPPED = 'UNSTOPPED',
}

export interface StartableLike {
    start(stopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
}

export interface OnStopping {
    (err?: Error): void;
}

export class StopDuringStarting extends Error { }

export abstract class Startable extends EventEmitter implements StartableLike {
    public readyState = ReadyState.STOPPED;
    private _onStoppings: OnStopping[] = [];
    private _stopErrorDuringStarting?: null | Error;
    private _resolve?: () => void;
    private _reject?: (err: Error) => void;

    public async assart(onStopping?: OnStopping): Promise<void> {
        assert(
            this.readyState === ReadyState.STARTING ||
            this.readyState === ReadyState.STARTED,
            'Not STARTING or STARTED.',
        );
        return this.start(onStopping);
    }

    protected abstract _start(): Promise<void>;
    private _starting = Promise.resolve();
    public start(onStopping?: OnStopping): Promise<void> {
        if (
            this.readyState === ReadyState.STOPPED ||
            this.readyState === ReadyState.UNSTOPPED
        ) {
            this.readyState = ReadyState.STARTING;
            this._stopErrorDuringStarting = null;
            this._onStoppings = [];

            // in case _start() calls start() syncly
            this._starting = new Promise((resolve, reject) => {
                this._resolve = resolve;
                this._reject = reject;
            });
            // this._starting.catch(() => { });

            this._start().then(() => {
                if (this._stopErrorDuringStarting!)
                    throw this._stopErrorDuringStarting;
            }).then(() => {
                this._resolve!();
                this.readyState = ReadyState.STARTED;
            }).catch(err => {
                this._reject!(err);
                this.readyState = ReadyState.UNSTARTED;
            });
        }
        if (onStopping) this._onStoppings.push(onStopping);
        return this._starting;
    }

    protected abstract _stop(err?: Error): Promise<void>;
    private _stopping = Promise.resolve();
    /*
        stop() 不能是 async，否则 stop() 的返回值和 this._stopping 不是
        同一个 Promise 对象，stop() 的值如果外部没有 catch 就会抛到全局空间去。
    */
    public stop = (err?: Error): Promise<void> => {
        if (this.readyState === ReadyState.STARTING) {
            this._stopErrorDuringStarting = err ||
                this._stopErrorDuringStarting ||
                new Error('.start() stopped by stop() with no reason.');
            return Promise.reject(
                new StopDuringStarting('.stop() called during starting.')
            );
            // const stopping = this.start()
            //     .finally(() => Promise.reject(
            //         new StopDuringStarting('Stop during starting.'),
            //     ));
            // stopping.catch(() => { });
            // return stopping;
        }
        if (
            this.readyState === ReadyState.STARTED ||
            this.readyState === ReadyState.UNSTARTED
        ) {
            this.readyState = ReadyState.STOPPING;
            for (const onStopping of this._onStoppings) onStopping(err);

            // in case _stop() or onStopping() calls stop() syncly
            this._stopping = new Promise((resolve, reject) => {
                this._resolve = resolve;
                this._reject = reject;
            })
            this._stopping.catch(() => { });

            this._stop(err).then(() => {
                this._resolve!();
                this.readyState = ReadyState.STOPPED;
            }).catch(err => {
                this._reject!(err);
                this.readyState = ReadyState.UNSTOPPED;
            });
        }
        return this._stopping;
    }
}
