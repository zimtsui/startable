import {
    Startable,
    // StopCalledDuringStarting,
    StartingFailedManually,
} from '../../build/index';
import sinon = require('sinon');
import test from 'ava';
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
const { fake } = sinon;
chai.use(chaiAsPromised);
const { assert } = chai;

test('start succ stop succ', async t => {
    const f = fake();
    class Service extends Startable {
        protected Startable$rawStart() {
            f();
            return Promise.resolve();
        }
        protected Startable$rawStop() {
            f();
            return Promise.resolve();
        }
    };
    const service = new Service();
    service.start();
    await service.start();
    service.stop();
    await service.stop();
    assert(f.callCount === 2);
});

test('start succ stop fail', async t => {
    const f = fake();
    class Service extends Startable {
        protected Startable$rawStart() {
            f();
            return Promise.resolve();
        }
        protected Startable$rawStop() {
            f();
            return Promise.reject(new Error('stop'));
        }
    };
    const service = new Service();
    await service.start();
    service.stop();
    await assert.isRejected(service.stop(), /^stop$/);
    assert(f.callCount === 2);
});

test('start fail stop succ', async t => {
    const f = fake();
    class Service extends Startable {
        protected Startable$rawStart() {
            f();
            return Promise.reject(new Error('start'));
        }
        protected Startable$rawStop() {
            f();
            return Promise.resolve();
        }
    };
    const service = new Service();
    service.start().catch(() => { });
    await assert.isRejected(service.start(), /^start$/);
    service.stop();
    await service.stop();
    assert(f.callCount === 2);
});

test('start fail stop fail', async t => {
    const f = fake();
    class Service extends Startable {
        protected Startable$rawStart() {
            f();
            return Promise.reject(new Error('start'));
        }
        protected Startable$rawStop() {
            f();
            return Promise.reject(new Error('stop'));
        }
    };
    const service = new Service();
    service.start().catch(() => { });
    await assert.isRejected(service.start(), /^start$/);
    service.stop();
    await assert.isRejected(service.stop(), /^stop$/);
    assert(f.callCount === 2);
});

// test('try stop during starting', async t => {
//     const f = fake();
//     let resolveStart: () => void;
//     class Service extends Startable {
//         protected rawStart() {
//             f();
//             return new Promise<void>(resolve => {
//                 resolveStart = resolve;
//             });
//         }
//         protected rawStop() {
//             f();
//             return Promise.resolve();
//         }
//     };
//     const service = new Service();
//     const pStart = service.start();
//     pStart.catch(() => { });
//     const pStop = service.tryStop(new Error('stop during starting'));
//     resolveStart!();
//     await assert.isRejected(pStart, /^stop during starting$/);
//     await assert.isRejected(pStop, StopCalledDuringStarting);
//     assert(f.callCount === 1);
// });

test('stop during starting', async t => {
    const f = fake();
    let resolveStart: () => void;
    class Service extends Startable {
        protected Startable$rawStart() {
            f();
            return new Promise<void>(resolve => {
                resolveStart = resolve;
            });
        }
        protected Startable$rawStop() {
            f();
            return Promise.resolve();
        }
    };
    const service = new Service();
    const pStart = service.start();
    pStart.catch(() => { });
    const pStop = service.stop();
    resolveStart!();
    await assert.isRejected(pStart, new StartingFailedManually().message);
    await assert.isFulfilled(pStop);
    assert(f.callCount === 2);
});
