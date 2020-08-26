import chai from 'chai';
const { assert } = chai;

const enum LifePeriod {
    CONSTRUCTED,
    STARTING,
    STARTED,
    FAILED,
    STOPPING,
    STOPPED,
    BROKEN,
}

interface StartableLike {
    start(stopping?: Stopping): Promise<void>;
    stop(err?: Error): Promise<void>;
}

// sync function
interface Stopping {
    (err?: Error): void
}

/*
    若 _start() 失败
        1. 会自动开始 _stop()
        2. start() 在 _stop() 完成时 rejected
        3. this.started 在 _start() 失败时 rejected
*/

abstract class Startable implements StartableLike {
    lifePeriod: LifePeriod = LifePeriod.CONSTRUCTED;
    private stopping?: Stopping;

    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;
    protected reusable = false;
    protected autoStopAfterFailed = true;
    protected startRejectedAfterStop = true;

    public started!: Promise<void>;
    public async start(stopping?: Stopping): Promise<void> {
        assert(
            this.lifePeriod === LifePeriod.CONSTRUCTED
            || this.reusable && this.lifePeriod === LifePeriod.STOPPED,
        );
        this.lifePeriod = LifePeriod.STARTING;

        this.stopping = stopping;

        this.started = this._start()
            .then(() => {
                this.lifePeriod = LifePeriod.STARTED;
            }, (err: Error) => {
                this.lifePeriod = LifePeriod.FAILED;
                throw err;
            });
        let returnValue = this.started;
        if (this.autoStopAfterFailed)
            returnValue = this.started.catch(async (errStart: Error) => {
                await this.stop(errStart);
                /* 
                    如果 stop 也出错就忽略掉 errStart
                    之所以不把两个错误合在一起是因为这不符合
                    sourcemap 插件的接口
                */
                throw errStart;
            });
        if (!this.startRejectedAfterStop) returnValue = this.started;
        return returnValue;
    }

    public stopped!: Promise<void>;
    public async stop(err?: Error): Promise<void> {
        assert(this.lifePeriod !== LifePeriod.CONSTRUCTED);
        if (
            this.lifePeriod === LifePeriod.STOPPING ||
            this.lifePeriod === LifePeriod.STOPPED ||
            this.lifePeriod === LifePeriod.BROKEN
        ) return this.stopped;
        if (this.lifePeriod === LifePeriod.STARTING)
            return this.started
                .catch(() => { })
                .then(() => this.stop());
        this.lifePeriod = LifePeriod.STOPPING;

        this.stopped = this._stop(err)
            .then(() => {
                this.lifePeriod = LifePeriod.STOPPED;
            }, (err: Error) => {
                this.lifePeriod = LifePeriod.BROKEN;
                throw err;
            });
        if (this.stopping) this.stopping(err);

        return this.stopped;
    }
}

export {
    Startable as default,
    Startable,
    StartableLike,
    LifePeriod,
    Stopping,
};