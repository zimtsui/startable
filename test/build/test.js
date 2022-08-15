"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
const sinon = require("sinon");
const ava_1 = require("ava");
const { fake } = sinon;
const assert = require("assert");
class StartError extends Error {
    constructor() {
        super('');
    }
}
class StopError extends Error {
    constructor() {
        super('');
    }
}
(0, ava_1.default)('start succ stop succ', async (t) => {
    const f = fake();
    const s = (0, __1.createStartable)(() => {
        f();
        assert(s.getReadyState() === __1.ReadyState.STARTING);
        return Promise.resolve();
    }, () => {
        f();
        assert(s.getReadyState() === __1.ReadyState.STOPPING);
        return Promise.resolve();
    });
    s.start();
    await s.start();
    s.stop();
    await s.stop();
    await s.getRunningPromise();
    assert(f.callCount === 2);
});
(0, ava_1.default)('start succ stop fail', async (t) => {
    const f = fake();
    const s = (0, __1.createStartable)(() => {
        f();
        return Promise.resolve();
    }, () => {
        f();
        return Promise.reject(new StopError());
    });
    await s.start();
    s.stop();
    await assert.rejects(s.stop(), StopError);
    await s.getRunningPromise();
    assert(f.callCount === 2);
});
(0, ava_1.default)('start fail stop succ', async (t) => {
    const f = fake();
    const s = (0, __1.createStartable)(() => {
        f();
        return Promise.reject(new StartError());
    }, () => {
        f();
        return Promise.resolve();
    });
    s.start();
    await assert.rejects(Promise.resolve(s.start()), StartError);
    s.stop();
    await s.stop();
    await s.getRunningPromise();
    assert(f.callCount === 2);
});
(0, ava_1.default)('start fail stop fail', async (t) => {
    const f = fake();
    const s = (0, __1.createStartable)(() => {
        f();
        return Promise.reject(new StartError());
    }, () => {
        f();
        return Promise.reject(new StopError());
    });
    s.start();
    await assert.rejects(Promise.resolve(s.start()), StartError);
    s.stop();
    await assert.rejects(s.stop(), StopError);
    await s.getRunningPromise();
    assert(f.callCount === 2);
});
(0, ava_1.default)('stop during starting', async (t) => {
    const f = fake();
    let resolveStart;
    const s = (0, __1.createStartable)(() => {
        f();
        return new Promise(resolve => {
            resolveStart = resolve;
        });
    }, () => {
        f();
        return Promise.resolve();
    });
    const pStart = Promise.resolve(s.start());
    class StopCalledDuringStarting extends Error {
    }
    const pStop = s.stop(new StopCalledDuringStarting());
    resolveStart();
    await assert.rejects(pStart, StopCalledDuringStarting);
    await assert.rejects(pStop, __1.StateError);
    await s.stop();
    assert(f.callCount === 2);
});
//# sourceMappingURL=test.js.map