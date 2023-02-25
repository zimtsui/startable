import { $, AsRawStart, AssetStateAsync, ReadyState, Startable, StateError } from '../..';
import sinon = require('sinon');
import test from 'ava';
const { fake } = sinon;
import assert = require('assert');


class StartError extends Error {
    public constructor() {
        super('');
    }
}
class StopError extends Error {
    public constructor() {
        super('');
    }
}

test('start succ stop succ', async t => {
    const f = fake();
    const s = new Startable(() => {
        f();
        assert(s.getReadyState() === ReadyState.STARTING);
        return Promise.resolve();
    }, () => {
        f();
        assert(s.getReadyState() === ReadyState.STOPPING);
        return Promise.resolve();
    });
    s.start();
    await s.start();
    s.stop();
    await s.stop();
    await s.getRunning();
    assert(f.callCount === 2);
});

test('start succ stop fail', async t => {

    const f = fake();
    const s = new Startable(() => {
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

test('start fail stop succ', async t => {
    const f = fake();
    const s = new Startable(() => {
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

test('start fail stop fail', async t => {
    const f = fake();
    const s = new Startable(() => {
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

test('stop during starting', async t => {
    const f = fake();
    let resolveStart: () => void;
    const s = new Startable(() => {
        f();
        return new Promise<void>(resolve => {
            resolveStart = resolve;
        });
    }, () => {
        f();
        return Promise.resolve();
    });
    const pStart = Promise.resolve(s.start());
    class StopCalledDuringStarting extends Error { }
    const pStop = s.stop(new StopCalledDuringStarting());
    resolveStart!();
    await pStart;
    await pStop;
    await s.stop();
    await assert.rejects(s.getRunning(), StopCalledDuringStarting);
    assert(f.callCount === 2);
});

test('class', async t => {
    class A {
        @AsRawStart()
        rawStart() { }
    }

    const a = new A();
    const pStart = $(a).start();
    await $(a).stop();
    await pStart;
});

test('assert state', async t => {
    class A {
        @AssetStateAsync()
        public async f() { }
    }
    const s = new A();
    $(s).start();
    await assert.rejects(s.f(), StateError);
    await $(s).start();
    await $(s).stop();
});

test('raw start bind', async t => {
    class A {
        public x = false;
        @AsRawStart()
        public async start() { this.x = true; }
    }
    const s = new A();
    await $(s).start();
    assert(s.x);
    await $(s).stop();
});
