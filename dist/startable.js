import chai from 'chai';
const { assert } = chai;
/*
    若 _start() 失败
        1. 会自动开始 _stop()
        2. start() 在 _stop() 完成时 rejected
        3. this.started 在 _start() 失败时 rejected
*/
class Startable {
    constructor() {
        this.lifePeriod = 0 /* CONSTRUCTED */;
        this.reusable = false;
        this.autoStopAfterFailed = true;
        this.startRejectedAfterStop = true;
    }
    async start(stopping) {
        assert(this.lifePeriod === 0 /* CONSTRUCTED */
            || this.reusable && this.lifePeriod === 5 /* STOPPED */);
        this.lifePeriod = 1 /* STARTING */;
        this.stopping = stopping;
        this.started = this._start()
            .then(() => {
            this.lifePeriod = 2 /* STARTED */;
        }, (err) => {
            this.lifePeriod = 3 /* FAILED */;
            throw err;
        });
        let returnValue = this.started;
        if (this.autoStopAfterFailed)
            returnValue = this.started.catch(async (errStart) => {
                await this.stop(errStart);
                /*
                    如果 stop 也出错就忽略掉 errStart
                    之所以不把两个错误合在一起是因为这不符合
                    sourcemap 插件的接口
                */
                throw errStart;
            });
        if (!this.startRejectedAfterStop)
            returnValue = this.started;
        return returnValue;
    }
    async stop(err) {
        assert(this.lifePeriod !== 0 /* CONSTRUCTED */);
        if (this.lifePeriod === 4 /* STOPPING */ ||
            this.lifePeriod === 5 /* STOPPED */ ||
            this.lifePeriod === 6 /* BROKEN */)
            return this.stopped;
        if (this.lifePeriod === 1 /* STARTING */)
            return this.started
                .catch(() => { })
                .then(() => this.stop());
        this.lifePeriod = 4 /* STOPPING */;
        this.stopped = this._stop(err)
            .then(() => {
            this.lifePeriod = 5 /* STOPPED */;
        }, (err) => {
            this.lifePeriod = 6 /* BROKEN */;
            throw err;
        });
        if (this.stopping)
            this.stopping(err);
        return this.stopped;
    }
}
export { Startable as default, Startable, };
//# sourceMappingURL=startable.js.map