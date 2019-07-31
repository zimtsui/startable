"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const bluebird_1 = __importDefault(require("bluebird"));
var LifePeriod;
(function (LifePeriod) {
    LifePeriod[LifePeriod["CONSTRUCTED"] = 0] = "CONSTRUCTED";
    LifePeriod[LifePeriod["STARTING"] = 1] = "STARTING";
    LifePeriod[LifePeriod["FAILED"] = 2] = "FAILED";
    LifePeriod[LifePeriod["STARTED"] = 3] = "STARTED";
    LifePeriod[LifePeriod["STOPPING"] = 4] = "STOPPING";
    LifePeriod[LifePeriod["STOPPED"] = 5] = "STOPPED";
})(LifePeriod || (LifePeriod = {}));
exports.LifePeriod = LifePeriod;
class Autonomous {
    constructor() {
        this.lifePeriod = LifePeriod.CONSTRUCTED;
        this._stopping = () => { };
        this._reusable = false;
    }
    start(stopping) {
        assert_1.default(this.lifePeriod === LifePeriod.CONSTRUCTED
            || this._reusable && this.lifePeriod === LifePeriod.STOPPED);
        this.lifePeriod = LifePeriod.STARTING;
        if (stopping)
            this._stopping = stopping;
        this._started = this._start();
        return bluebird_1.default.resolve(this._started)
            .then(() => {
            this.lifePeriod = LifePeriod.STARTED;
        }).tapCatch((err) => {
            this.lifePeriod = LifePeriod.FAILED;
            return this.stop(err);
        });
    }
    stop(err) {
        assert_1.default(this.lifePeriod !== LifePeriod.CONSTRUCTED);
        if (this.lifePeriod === LifePeriod.STOPPED)
            return Promise.resolve();
        if (this.lifePeriod === LifePeriod.STOPPING)
            return this._stopped;
        if (this.lifePeriod === LifePeriod.STARTING)
            return this._started
                .then(() => this.stop())
                .catch((err) => this.stop(err));
        this.lifePeriod = LifePeriod.STOPPING;
        this._stopping(err);
        this._stopped = this._stop(err);
        return this._stopped
            .then(() => {
            this.lifePeriod = LifePeriod.STOPPED;
        });
    }
}
exports.Autonomous = Autonomous;
exports.default = Autonomous;
//# sourceMappingURL=index.js.map