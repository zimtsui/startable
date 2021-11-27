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

export class StopCalledDuringStarting extends Error {
    constructor() {
        super('.stop() is called during STARTING. The ongoing start() will fail.');
    }
}

export abstract class Startable extends EventEmitter implements StartableLike {
    public readyState = ReadyState.STOPPED;
    private Startable$onStoppings: OnStopping[] = [];
    private Startable$errorDuringStarting?: null | Error;
    private Startable$resolve?: () => void;
    private Startable$reject?: (err: Error) => void;

    public async assart(onStopping?: OnStopping): Promise<void> {
        assert(
            this.readyState === ReadyState.STARTING ||
            this.readyState === ReadyState.STARTED,
            '.assert() is allowed during only STARTING or STARTED.',
        );
        return this.start(onStopping);
    }

    protected abstract Startable$start(): Promise<void>;
    private Startable$starting = Promise.resolve();
    public start(onStopping?: OnStopping): Promise<void> {
        if (
            this.readyState === ReadyState.STOPPED ||
            this.readyState === ReadyState.UNSTOPPED
        ) {
            this.readyState = ReadyState.STARTING;
            this.Startable$errorDuringStarting = null;
            this.Startable$onStoppings = [];

            // in case Startable$start() calls start() syncly
            this.Startable$starting = new Promise((resolve, reject) => {
                this.Startable$resolve = resolve;
                this.Startable$reject = reject;
            });
            // this.Startable$starting.catch(() => { });

            this.Startable$start().then(() => {
                if (this.Startable$errorDuringStarting!)
                    throw this.Startable$errorDuringStarting;
            }).then(() => {
                this.Startable$resolve!();
                this.readyState = ReadyState.STARTED;
            }).catch(err => {
                this.Startable$reject!(err);
                this.readyState = ReadyState.UNSTARTED;
            });
        }
        if (onStopping) this.Startable$onStoppings.push(onStopping);
        return this.Startable$starting;
    }

    protected abstract Startable$stop(err?: Error): Promise<void>;
    private Startable$stopping = Promise.resolve();
    /*
        stop() 不能是 async，否则 stop() 的返回值和 this.Startable$stopping 不是
        同一个 Promise 对象，stop() 的值如果外部没有 catch 就会抛到全局空间去。
    */
    public stop = (err?: Error): Promise<void> => {
        if (this.readyState === ReadyState.STARTING) {
            const abortionDuringStarting = new StopCalledDuringStarting();
            this.Startable$errorDuringStarting =
                err ||
                this.Startable$errorDuringStarting ||
                abortionDuringStarting;
            return Promise.reject(abortionDuringStarting);
        }
        if (
            this.readyState === ReadyState.STARTED ||
            this.readyState === ReadyState.UNSTARTED
        ) {
            this.readyState = ReadyState.STOPPING;
            for (const onStopping of this.Startable$onStoppings) onStopping(err);

            // in case $Startable$stop() or onStopping() calls stop() syncly
            this.Startable$stopping = new Promise((resolve, reject) => {
                this.Startable$resolve = resolve;
                this.Startable$reject = reject;
            })
            this.Startable$stopping.catch(() => { });

            this.Startable$stop(err).then(() => {
                this.Startable$resolve!();
                this.readyState = ReadyState.STOPPED;
            }).catch(err => {
                this.Startable$reject!(err);
                this.readyState = ReadyState.UNSTOPPED;
            });
        }
        return this.Startable$stopping;
    }
}
