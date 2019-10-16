import assert from 'assert';
import { boundMethod } from 'autobind-decorator';
import autoExitDecorator from './auto-exit-decorator';

enum LifePeriod {
    CONSTRUCTED,
    STARTING,
    FAILED,
    STARTED,
    STOPPING,
    STOPPED,
}

interface Stopping {
    (err?: Error): void
}

abstract class Autonomous {
    lifePeriod: LifePeriod = LifePeriod.CONSTRUCTED;
    private _stopping: Stopping | undefined;

    protected abstract _start(): Promise<void>;
    protected abstract _stop(): Promise<void>;
    protected reusable = false;

    private _started!: Promise<void>;
    @boundMethod
    public async start(stopping?: Stopping): Promise<void> {
        assert(
            this.lifePeriod === LifePeriod.CONSTRUCTED
            || this.reusable && this.lifePeriod === LifePeriod.STOPPED,
        );
        this.lifePeriod = LifePeriod.STARTING;

        this._stopping = stopping;

        this._started = this._start()
            .then(() => {
                this.lifePeriod = LifePeriod.STARTED;
            }).catch(err => {
                this.lifePeriod = LifePeriod.FAILED;
                throw err;
            });
        return this._started
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

    private _stopped!: Promise<void>;
    @boundMethod
    public async stop(err?: Error): Promise<void> {
        assert(this.lifePeriod !== LifePeriod.CONSTRUCTED);
        if (this.lifePeriod === LifePeriod.STOPPED)
            return Promise.resolve();
        if (this.lifePeriod === LifePeriod.STOPPING)
            return this._stopped;
        if (this.lifePeriod === LifePeriod.STARTING)
            return this._started
                .then(() => this.stop())
                .catch(() => this.stop());
        this.lifePeriod = LifePeriod.STOPPING;

        if (this._stopping) this._stopping(err);

        return this._stopped = this._stop()
            .then(() => {
                this.lifePeriod = LifePeriod.STOPPED;
            });
    }
}

export default Autonomous;
export {
    Autonomous,
    LifePeriod,
    Stopping,
    autoExitDecorator,
};