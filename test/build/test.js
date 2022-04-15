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
    const s = index_1.Startable.create(async () => {
        f();
        return Promise.resolve();
    }, async () => {
        f();
        return Promise.resolve();
    });
    s.start();
    await s.start();
    s.stop();
    await s.stop();
    assert(f.callCount === 2);
});
(0, ava_1.default)('start succ stop fail', async (t) => {
    const f = fake();
    const s = index_1.Startable.create(async () => {
        f();
        return Promise.resolve();
    }, async () => {
        f();
        return Promise.reject(new Error('stop'));
    });
    await s.start();
    s.stop();
    await assert.isRejected(s.stop(), /^stop$/);
    assert(f.callCount === 2);
});
(0, ava_1.default)('start fail stop succ', async (t) => {
    const f = fake();
    const s = index_1.Startable.create(async () => {
        f();
        return Promise.reject(new Error('start'));
    }, async () => {
        f();
        return Promise.resolve();
    });
    s.start().catch(() => { });
    await assert.isRejected(s.start(), /^start$/);
    s.stop();
    await s.stop();
    assert(f.callCount === 2);
});
(0, ava_1.default)('start fail stop fail', async (t) => {
    const f = fake();
    const s = index_1.Startable.create(async () => {
        f();
        return Promise.reject(new Error('start'));
    }, async () => {
        f();
        return Promise.reject(new Error('stop'));
    });
    s.start().catch(() => { });
    await assert.isRejected(s.start(), /^start$/);
    s.stop();
    await assert.isRejected(s.stop(), /^stop$/);
    assert(f.callCount === 2);
});
(0, ava_1.default)('stop during starting', async (t) => {
    const f = fake();
    let resolveStart;
    const s = index_1.Startable.create(async () => {
        f();
        return new Promise(resolve => {
            resolveStart = resolve;
        });
    }, async () => {
        f();
        return Promise.resolve();
    });
    const pStart = s.start();
    pStart.catch(() => { });
    const pStop = s.stop();
    resolveStart();
    await assert.isRejected(pStart, new index_1.StopCalledDuringStarting().message);
    await assert.isFulfilled(pStop);
    assert(f.callCount === 2);
});
//# sourceMappingURL=test.js.map