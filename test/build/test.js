"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const startable_1 = require("../../build/startable");
const sinon = require("sinon");
const ava_1 = require("ava");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { fake } = sinon;
chai.use(chaiAsPromised);
const { assert } = chai;
ava_1.default('start succ stop succ', async (t) => {
    const f = fake();
    class Service extends startable_1.Startable {
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
    service.start();
    await service.start();
    service.stop();
    await service.stop();
    assert(f.callCount === 2);
});
ava_1.default('start succ stop fail', async (t) => {
    const f = fake();
    class Service extends startable_1.Startable {
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
    service.stop();
    await assert.isRejected(service.stop(), /^stop$/);
    assert(f.callCount === 2);
});
ava_1.default('start fail stop succ', async (t) => {
    const f = fake();
    class Service extends startable_1.Startable {
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
    service.start().catch(() => { });
    await assert.isRejected(service.start(), /^start$/);
    service.stop();
    await service.stop();
    assert(f.callCount === 2);
});
ava_1.default('start fail stop fail', async (t) => {
    const f = fake();
    class Service extends startable_1.Startable {
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
    service.start().catch(() => { });
    await assert.isRejected(service.start(), /^start$/);
    service.stop();
    await assert.isRejected(service.stop(), /^stop$/);
    assert(f.callCount === 2);
});
ava_1.default('stop during starting', async (t) => {
    const f = fake();
    let resolveStart;
    class Service extends startable_1.Startable {
        _start() {
            f();
            return new Promise(resolve => {
                resolveStart = resolve;
            });
        }
        _stop() {
            f();
            return Promise.resolve();
        }
    }
    ;
    const service = new Service();
    const pStart = service.start();
    pStart.catch(() => { });
    const pStop = service.stop(new Error('stop during starting'));
    resolveStart();
    await assert.isRejected(pStart, /^stop during starting$/);
    await assert.isRejected(pStop, startable_1.StopDuringStarting);
    assert(f.callCount === 1);
});
//# sourceMappingURL=test.js.map