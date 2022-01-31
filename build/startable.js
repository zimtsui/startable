"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Startable = exports.StopCalledDuringStarting = void 0;
const events_1 = require("events");
const chai_1 = require("chai");
const autobind_decorator_1 = require("autobind-decorator");
class StopCalledDuringStarting extends Error {
    constructor() {
        super('.stop() is called during STARTING. The ongoing start() will fail.');
    }
}
exports.StopCalledDuringStarting = StopCalledDuringStarting;
class Startable extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.readyState = "STOPPED" /* STOPPED */;
        this.Startable$onStoppings = [];
        this.Startable$starting = Promise.resolve();
        this.Startable$stopping = Promise.resolve();
    }
    async Startable$assartUncaught(onStopping) {
        (0, chai_1.assert)(this.readyState === "STARTING" /* STARTING */ ||
            this.readyState === "STARTED" /* STARTED */, '.assert() is allowed during only STARTING or STARTED.');
        await this.start(onStopping);
    }
    assart(onStopping) {
        const promise = this.Startable$assartUncaught(onStopping);
        promise.catch(() => { });
        return promise;
    }
    async Startable$startUncaught(onStopping) {
        if (this.readyState !== "STOPPING" /* STOPPING */ && onStopping)
            this.Startable$onStoppings.push(onStopping);
        if (this.readyState === "STOPPED" /* STOPPED */ ||
            this.readyState === "UNSTOPPED" /* UNSTOPPED */) {
            this.readyState = "STARTING" /* STARTING */;
            this.Startable$errorDuringStarting = null;
            this.Startable$onStoppings = [];
            // in case Startable$start() calls start() syncly
            this.Startable$starting = new Promise((resolve, reject) => {
                this.Startable$resolve = resolve;
                this.Startable$reject = reject;
            });
            try {
                await this.rawStart();
                if (this.Startable$errorDuringStarting)
                    throw this.Startable$errorDuringStarting;
                this.Startable$resolve();
                this.readyState = "STARTED" /* STARTED */;
            }
            catch (err) {
                this.Startable$reject(err);
                this.readyState = "UNSTARTED" /* UNSTARTED */;
            }
        }
        await this.Startable$starting;
    }
    start(onStopping) {
        const promise = this.Startable$startUncaught(onStopping);
        promise.catch(() => { });
        return promise;
    }
    /*
        stop() 不能是 async，否则 stop() 的返回值和 this.Startable$stopping 不是
        同一个 Promise 对象，stop() 的值如果外部没有 catch 就会抛到全局空间去。
    */
    async Startable$tryStopUncaught(err) {
        if (this.readyState === "STARTING" /* STARTING */) {
            this.Startable$errorDuringStarting =
                err ||
                    this.Startable$errorDuringStarting ||
                    new StopCalledDuringStarting();
            throw new StopCalledDuringStarting();
        }
        if (this.readyState === "STARTED" /* STARTED */ ||
            this.readyState === "UNSTARTED" /* UNSTARTED */) {
            this.readyState = "STOPPING" /* STOPPING */;
            for (const onStopping of this.Startable$onStoppings)
                onStopping(err);
            // in case $Startable$stop() or onStopping() calls stop() syncly
            this.Startable$stopping = new Promise((resolve, reject) => {
                this.Startable$resolve = resolve;
                this.Startable$reject = reject;
            });
            try {
                await this.rawStop(err);
                this.Startable$resolve();
                this.readyState = "STOPPED" /* STOPPED */;
            }
            catch (err) {
                this.Startable$reject(err);
                this.readyState = "UNSTOPPED" /* UNSTOPPED */;
            }
        }
        await this.Startable$stopping;
    }
    tryStop(err) {
        const promise = this.Startable$tryStopUncaught(err);
        promise.catch(() => { });
        return promise;
    }
    async Startable$stopUncaught(err) {
        try {
            await this.tryStop(err);
        }
        catch (errDuringStopping) {
            if (errDuringStopping instanceof StopCalledDuringStarting) {
                await this.start().catch(() => { });
                await this.tryStop(err);
            }
            else
                throw errDuringStopping;
        }
    }
    stop(err) {
        const promise = this.Startable$stopUncaught(err);
        promise.catch(() => { });
        return promise;
    }
}
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "assart", null);
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "start", null);
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "tryStop", null);
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "stop", null);
exports.Startable = Startable;
//# sourceMappingURL=startable.js.map