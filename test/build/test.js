"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
    const s = new __1.Startable(() => {
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
    await s.getRunning();
    assert(f.callCount === 2);
});
(0, ava_1.default)('start succ stop fail', async (t) => {
    const f = fake();
    const s = new __1.Startable(() => {
        f();
        return Promise.resolve();
    }, () => {
        f();
        return Promise.reject(new StopError());
    });
    await s.start();
    s.stop();
    await assert.rejects(s.stop(), StopError);
    await s.getRunning();
    assert(f.callCount === 2);
});
(0, ava_1.default)('start fail stop succ', async (t) => {
    const f = fake();
    const s = new __1.Startable(() => {
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
    await s.getRunning();
    assert(f.callCount === 2);
});
(0, ava_1.default)('start fail stop fail', async (t) => {
    const f = fake();
    const s = new __1.Startable(() => {
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
    await s.getRunning();
    assert(f.callCount === 2);
});
(0, ava_1.default)('stop during starting', async (t) => {
    const f = fake();
    let resolveStart;
    const s = new __1.Startable(() => {
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
    await pStart;
    await pStop;
    await s.stop();
    await assert.rejects(s.getRunning(), StopCalledDuringStarting);
    assert(f.callCount === 2);
});
(0, ava_1.default)('class', async (t) => {
    class A {
        rawStart() { }
    }
    __decorate([
        (0, __1.AsRawStart)()
    ], A.prototype, "rawStart", null);
    const a = new A();
    const pStart = (0, __1.$)(a).start();
    await (0, __1.$)(a).stop();
    await pStart;
});
//# sourceMappingURL=test.js.map