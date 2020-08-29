import chai from 'chai';
import { PrimitiveStartable, } from './primitive';
const { assert } = chai;
class Startable extends PrimitiveStartable {
    constructor() {
        super(...arguments);
        this.reusable = false;
        this.autoStopAfterFailed = true;
        this.startRejectedAfterStopIfFailed = false;
    }
    async start(onStopping) {
        assert(this.reusable || this.lifePeriod !== 5 /* STOPPED */);
        super.start(onStopping).catch(() => { });
        if (this.autoStopAfterFailed) {
            const stoppedIffailed = this.started
                .catch(async (errStart) => {
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
        }
        else
            return this.started;
    }
}
export * from './primitive';
export { Startable as default, Startable, };
//# sourceMappingURL=startable.js.map