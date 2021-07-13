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
    await service.start();
    service.stop().catch(() => { });
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
    service.stop().catch(() => { });
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
    await assert.isRejected(service.start(), /^start$/);
    service.stop().catch(() => { });
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
    await assert.isRejected(service.start(), /^start$/);
    service.stop().catch(() => { });
    await assert.isRejected(service.stop(), /^stop$/);
    assert(f.callCount === 2);
});
//# sourceMappingURL=test.js.map