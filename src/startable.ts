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

abstract class Startable implements StartableLike {
    lifePeriod: LifePeriod = LifePeriod.CONSTRUCTED;
    private stopping?: Stopping;

    protected abstract _start(): Promise<void>;
    protected abstract _stop(err?: Error): Promise<void>;
    protected reusable = false;

    private started!: Promise<void>;
    public async start(stopping?: Stopping): Promise<void> {
        assert(
            this.lifePeriod === LifePeriod.CONSTRUCTED
            || this.reusable && this.lifePeriod === LifePeriod.STOPPED,
        );
        this.lifePeriod = LifePeriod.STARTING;

        this.stopping = stopping;

        const _started = this._start()
            .then(() => {
                this.lifePeriod = LifePeriod.STARTED;
            }, (err: Error) => {
                this.lifePeriod = LifePeriod.FAILED;
                throw err;
            });
        return this.started = _started
            .catch(async (errStart: Error) => {
                await this.stop();
                /* 
                    如果 stop 也出错就忽略掉 errStart
                    之所以不把两个错误合在一起是因为这不符合
                    sourcemap 插件的接口
                */
                throw errStart;
            });
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