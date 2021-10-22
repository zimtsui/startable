import {
    Startable,
    StartDuringStopping,
    StopDuringStarting,
} from '../../build/startable';
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
        protected _start() {
            f();
            return Promise.resolve();
        }
        protected _stop() {
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
        protected _start() {
            f();
            return Promise.resolve();
        }
        protected _stop() {
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
        protected _start() {
            f();
            return Promise.reject(new Error('start'));
        }
        protected _stop() {
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
        protected _start() {
            f();
            return Promise.reject(new Error('start'));
        }
        protected _stop() {
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

test('stop during starting', async t => {
    const f = fake();
    let resolveStart: () => void;
    class Service extends Startable {
        protected _start() {
            f();
            return new Promise<void>(resolve => {
                resolveStart = resolve;
            });
        }
        protected _stop() {
            f();
            return Promise.resolve();
        }
    };
    const service = new Service();
    const pStart = service.start();
    pStart.catch(() => { });
    const pStop = service.stop(new Error('stop during starting'));
    resolveStart!();
    await assert.isRejected(pStart, /^stop during starting$/);
    await assert.isRejected(pStop, StopDuringStarting);
    assert(f.callCount === 1);
});

test('start during stopping', async t => {
    const f = fake();
    let resolveStop: () => void;
    class Service extends Startable {
        protected _start() {
            f();
            return Promise.resolve();
        }
        protected _stop() {
            f();
            return new Promise<void>(resolve => {
                resolveStop = resolve;
            });
        }
    };
    const service = new Service();
    await service.start();
    const pStop = service.stop();
    pStop.catch(() => { });
    const pStart = service.start();
    resolveStop!();
    await assert.isRejected(pStart, StartDuringStopping);
    await pStop;
    assert(f.callCount === 2);
});
