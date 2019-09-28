"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const assert_1 = __importDefault(require("assert"));
const autobind_decorator_1 = require("autobind-decorator");
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
        this._reusable = false;
    }
    start(stopping) {
        assert_1.default(this.lifePeriod === LifePeriod.CONSTRUCTED
            || this._reusable && this.lifePeriod === LifePeriod.STOPPED);
        this.lifePeriod = LifePeriod.STARTING;
        this._stopping = stopping;
        this._started = this._start()
            .then(() => {
            this.lifePeriod = LifePeriod.STARTED;
        }).catch(err => {
            this.lifePeriod = LifePeriod.FAILED;
            throw err;
        });
        return this._started
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            yield this.stop();
            throw err;
        }));
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
                .catch(() => this.stop());
        this.lifePeriod = LifePeriod.STOPPING;
        this._stopping && this._stopping(err);
        return this._stopped = this._stop()
            .then(() => {
            this.lifePeriod = LifePeriod.STOPPED;
        });
    }
}
__decorate([
    autobind_decorator_1.boundMethod
], Autonomous.prototype, "start", null);
__decorate([
    autobind_decorator_1.boundMethod
], Autonomous.prototype, "stop", null);
exports.Autonomous = Autonomous;
exports.default = Autonomous;
//# sourceMappingURL=index.js.map