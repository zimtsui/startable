"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const __1 = __importDefault(require("../.."));
const bluebird_1 = __importDefault(require("bluebird"));
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
chai_1.default.use(chai_as_promised_1.default);
const { assert } = chai_1.default;
class TimerSuccessful extends __1.default {
    _start() {
        return bluebird_1.default.delay(100);
    }
    _stop() {
        return bluebird_1.default.delay(100);
    }
}
class TimerFailed extends __1.default {
    _start() {
        return bluebird_1.default.delay(100).throw(new Error());
    }
    _stop() {
        return bluebird_1.default.delay(100);
    }
}
ava_1.default.serial('successful & started', (t) => __awaiter(this, void 0, void 0, function* () {
    const timer = new TimerSuccessful();
    const timeStarting = Date.now();
    yield timer.start();
    const timeStarted = Date.now();
    yield timer.stop();
    const timeStopped = Date.now();
    t.log(timeStarted - timeStarting);
    t.log(timeStopped - timeStarted);
}));
ava_1.default.serial('successful & starting', (t) => __awaiter(this, void 0, void 0, function* () {
    const timer = new TimerSuccessful();
    const timeStarting = Date.now();
    let timeStarted;
    timer.start().then(() => {
        timeStarted = Date.now();
    });
    yield timer.stop();
    const timeStopped = Date.now();
    assert.strictEqual(typeof timeStarted, 'number');
    t.log(timeStopped - timeStarted);
    t.log(timeStarted - timeStarting);
}));
ava_1.default.serial('failed', (t) => __awaiter(this, void 0, void 0, function* () {
    const timer = new TimerFailed();
    const timeStarting = Date.now();
    const assertion = assert.isRejected(timer.start());
    yield timer.stop();
    const timeStopped = Date.now();
    t.log(timeStopped - timeStarting);
    yield assertion;
}));
//# sourceMappingURL=test.js.map