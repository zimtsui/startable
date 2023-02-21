import { Startable } from '../..';
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
    const s = Startable.create(() => {
        f();
        assert(s.getState() === Startable.ReadyState.STARTING);
        return Promise.resolve();
    }, () => {
        f();
        assert(s.getState() === Startable.ReadyState.STOPPING);
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
    const s = Startable.create(() => {
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
    const s = Startable.create(() => {
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
    const s = Startable.create(() => {
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
    const s = Startable.create(() => {
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
    await assert.rejects(pStart, StopCalledDuringStarting);
    await assert.rejects(pStop, Startable.StateError);
    await s.stop();
    assert(f.callCount === 2);
});
