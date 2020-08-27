import chai from 'chai';
import {
    PrimitiveStartable,
    Stopping,
    LifePeriod,
} from './primitive';
const { assert } = chai;

abstract class Startable extends PrimitiveStartable {
    protected reusable = false;
    protected autoStopAfterFailed = true;
    protected startRejectedAfterStopIfFailed = false;

    public async start(stopping?: Stopping): Promise<void> {
        assert(this.reusable || this.lifePeriod !== LifePeriod.STOPPED);
        super.start(stopping).catch(() => { });

        if (this.autoStopAfterFailed) {
            const stoppedIffailed = this.started!
                .catch(async (errStart: Error) => {
                    await this.stop(errStart);
                    /* 
                        如果 stop 也出错就忽略掉 errStart
                        之所以不把两个错误合在一起是因为这不符合
                        sourcemap 插件的接口
                    */
                    throw errStart;
                });
            stoppedIffailed.catch(() => { });
            return this.startRejectedAfterStopIfFailed ? stoppedIffailed : this.started;
        } else return this.started;
    }
}

export * from './primitive';
export {
    Startable as default,
    Startable,
};