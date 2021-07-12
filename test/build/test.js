import Startable from '#startable';
import sinon from 'sinon';
import test from 'ava';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
const { fake } = sinon;
chai.use(chaiAsPromised);
const { assert } = chai;
test('start succ stop succ', async (t) => {
    const f = fake();
    class Service extends Startable {
        _start() {
            f();
            return Promise.resolve();
        }
        _stop() {
            f();
            return Promise.resolve();
        }
    }
    ;
    const service = new Service();
    await service.start();
    service.stop().catch(() => { });
    await service.stop();
    assert(f.callCount === 2);
});
test('start succ stop fail', async (t) => {
    const f = fake();
    class Service extends Startable {
        _start() {
            f();
            return Promise.resolve();
        }
        _stop() {
            f();
            return Promise.reject(new Error('stop'));
        }
    }
    ;
    const service = new Service();
    await service.start();
    service.stop().catch(() => { });
    await assert.isRejected(service.stop(), /^stop$/);
    assert(f.callCount === 2);
});
test('start fail stop succ', async (t) => {
    const f = fake();
    class Service extends Startable {
        _start() {
            f();
            return Promise.reject(new Error('start'));
        }
        _stop() {
            f();
            return Promise.resolve();
        }
    }
    ;
    const service = new Service();
    await assert.isRejected(service.start(), /^start$/);
    service.stop().catch(() => { });
    await service.stop();
    assert(f.callCount === 2);
});
test('start fail stop fail', async (t) => {
    const f = fake();
    class Service extends Startable {
        _start() {
            f();
            return Promise.reject(new Error('start'));
        }
        _stop() {
            f();
            return Promise.reject(new Error('stop'));
        }
    }
    ;
    const service = new Service();
    await assert.isRejected(service.start(), /^start$/);
    service.stop().catch(() => { });
    await assert.isRejected(service.stop(), /^stop$/);
    assert(f.callCount === 2);
});
//# sourceMappingURL=test.js.map