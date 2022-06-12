import {
    Startable,
    StarpCalledDuringStarting,
    ReadyState,
} from '../..';
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
    const s = Startable.create(async () => {
        f();
        assert(s.getReadyState() === ReadyState.STARTING);
        return Promise.resolve();
    }, async () => {
        f();
        assert(s.getReadyState() === ReadyState.STOPPING);
        return Promise.resolve();
    });
    s.start();
    await s.start();
    s.stop();
    await s.stop();
    assert(f.callCount === 2);
});

test('start succ stop fail', async t => {
    const f = fake();
    const s = Startable.create(async () => {
        f();
        return Promise.resolve();
    }, async () => {
        f();
        return Promise.reject(new StopError());
    });
    await s.start();
    s.stop().catch(() => { });
    await assert.rejects(s.stop(), StopError);
    assert(f.callCount === 2);
});

test('start fail stop succ', async t => {
    const f = fake();
    const s = Startable.create(async () => {
        f();
        return Promise.reject(new StartError());
    }, async () => {
        f();
        return Promise.resolve();
    });
    s.start().catch(() => { });
    await assert.rejects(s.start(), StartError);
    s.stop();
    await s.stop();
    assert(f.callCount === 2);
});

test('start fail stop fail', async t => {
    const f = fake();
    const s = Startable.create(async () => {
        f();
        return Promise.reject(new StartError());

    }, async () => {
        f();
        return Promise.reject(new StopError());
    });
    s.start().catch(() => { });
    await assert.rejects(s.start(), StartError);
    s.stop().catch(() => { });
    await assert.rejects(s.stop(), StopError);
    assert(f.callCount === 2);
});

test('starp during starting', async t => {
    const f = fake();
    let resolveStart: () => void;
    const s = Startable.create(async () => {
        f();
        return new Promise<void>(resolve => {
            resolveStart = resolve;
        });
    }, async () => {
        f();
        return Promise.resolve();
    });
    const pStart = s.start();
    pStart.catch(() => { });
    const pStarp = s.starp();
    resolveStart!();
    await assert.rejects(pStart, StarpCalledDuringStarting);
    await pStarp;
    assert(f.callCount === 2);
});
