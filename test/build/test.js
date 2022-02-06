"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../build/index");
const sinon = require("sinon");
const ava_1 = require("ava");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { fake } = sinon;
chai.use(chaiAsPromised);
const { assert } = chai;
(0, ava_1.default)('start succ stop succ', async (t) => {
    const f = fake();
    class Service extends index_1.Startable {
        Startable$rawStart() {
            f();
            return Promise.resolve();
        }
        Startable$rawStop() {
            f();
            return Promise.resolve();
        }
    }
    ;
    const service = new Service();
    service.start();
    await service.start();
    service.stop();
    await service.stop();
    assert(f.callCount === 2);
});
(0, ava_1.default)('start succ stop fail', async (t) => {
    const f = fake();
    class Service extends index_1.Startable {
        Startable$rawStart() {
            f();
            return Promise.resolve();
        }
        Startable$rawStop() {
            f();
            return Promise.reject(new Error('stop'));
        }
    }
    ;
    const service = new Service();
    await service.start();
    service.stop();
    await assert.isRejected(service.stop(), /^stop$/);
    assert(f.callCount === 2);
});
(0, ava_1.default)('start fail stop succ', async (t) => {
    const f = fake();
    class Service extends index_1.Startable {
        Startable$rawStart() {
            f();
            return Promise.reject(new Error('start'));
        }
        Startable$rawStop() {
            f();
            return Promise.resolve();
        }
    }
    ;
    const service = new Service();
    service.start().catch(() => { });
    await assert.isRejected(service.start(), /^start$/);
    service.stop();
    await service.stop();
    assert(f.callCount === 2);
});
(0, ava_1.default)('start fail stop fail', async (t) => {
    const f = fake();
    class Service extends index_1.Startable {
        Startable$rawStart() {
            f();
            return Promise.reject(new Error('start'));
        }
        Startable$rawStop() {
            f();
            return Promise.reject(new Error('stop'));
        }
    }
    ;
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
(0, ava_1.default)('stop during starting', async (t) => {
    const f = fake();
    let resolveStart;
    class Service extends index_1.Startable {
        Startable$rawStart() {
            f();
            return new Promise(resolve => {
                resolveStart = resolve;
            });
        }
        Startable$rawStop() {
            f();
            return Promise.resolve();
        }
    }
    ;
    const service = new Service();
    const pStart = service.start();
    pStart.catch(() => { });
    const pStop = service.stop();
    resolveStart();
    await assert.isRejected(pStart, new index_1.StartingFailedManually().message);
    await assert.isFulfilled(pStop);
    assert(f.callCount === 2);
});
//# sourceMappingURL=test.js.map