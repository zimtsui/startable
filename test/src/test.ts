import test from 'ava';
import Autonomous from '../..';
import Bluebird from 'bluebird';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const { assert } = chai;

class TimerSuccessful extends Autonomous {
    protected _start() {
        return Bluebird.delay(100);
    }

    protected _stop() {
        return Bluebird.delay(100);
    }
}

class TimerFailed extends Autonomous {
    protected _start() {
        return Bluebird.delay(100).throw(new Error());
    }

    protected _stop() {
        return Bluebird.delay(100);
    }
}

test.serial('successful & started', async t => {
    const timer = new TimerSuccessful();
    const timeStarting = Date.now();

    await timer.start();

    const timeStarted = Date.now();

    await timer.stop();

    const timeStopped = Date.now();
    t.log(timeStarted - timeStarting);
    t.log(timeStopped - timeStarted);
});

test.serial('successful & starting', async t => {
    const timer = new TimerSuccessful();

    const timeStarting = Date.now();
    let timeStarted: number | undefined;

    timer.start().then(() => {
        timeStarted = Date.now();
    });
    await timer.stop();

    const timeStopped = Date.now();

    assert.strictEqual(typeof timeStarted, 'number');
    t.log(timeStopped - timeStarted!);
    t.log(timeStarted! - timeStarting);
});

test.serial('failed', async t => {
    const timer = new TimerFailed();

    const timeStarting = Date.now();

    const assertion = assert.isRejected(timer.start());

    await timer.stop();
    const timeStopped = Date.now();
    t.log(timeStopped - timeStarting);

    await assertion;
});