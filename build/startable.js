"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Startable = exports.StartingFailedManually = exports.StopCalledDuringStarting = void 0;
const events_1 = require("events");
const chai_1 = require("chai");
const autobind_decorator_1 = require("autobind-decorator");
class StopCalledDuringStarting extends Error {
    constructor() {
        super('.stop() is called during STARTING.');
    }
}
exports.StopCalledDuringStarting = StopCalledDuringStarting;
class StartingFailedManually extends Error {
    constructor() {
        super('.failStarting() was called during STARTING.');
    }
}
exports.StartingFailedManually = StartingFailedManually;
class Startable extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.readyState = "STOPPED" /* STOPPED */;
        this.Startable$onStoppings = [];
        this.Startable$starting = Promise.resolve();
        this.Startable$stopping = Promise.resolve();
    }
    async assart(onStopping) {
        (0, chai_1.assert)(this.readyState === "STARTING" /* STARTING */ ||
            this.readyState === "STARTED" /* STARTED */, '.assert() is allowed during only STARTING or STARTED.');
        await this.start(onStopping);
    }
    async start(onStopping) {
        if (this.readyState === "STOPPED" /* STOPPED */ ||
            this.readyState === "UNSTOPPED" /* UNSTOPPED */) {
            this.readyState = "STARTING" /* STARTING */;
            this.Startable$errorDuringStarting = null;
            this.Startable$onStoppings = onStopping ? [onStopping] : [];
            // in case Startable$start() calls start() syncly
            this.Startable$starting = new Promise((resolve, reject) => {
                this.Startable$resolve = resolve;
                this.Startable$reject = reject;
            });
            try {
                await this.Startable$rawStart();
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
        else if (this.readyState !== "STOPPING" /* STOPPING */ && onStopping)
            this.Startable$onStoppings.push(onStopping);
        await this.Startable$starting;
    }
    async tryStop(err) {
        if (this.readyState === "STARTING" /* STARTING */)
            throw new StopCalledDuringStarting();
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
                await this.Startable$rawStop(err);
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
    failStarting() {
        if (this.readyState !== "STARTING" /* STARTING */)
            return;
        this.Startable$errorDuringStarting =
            this.Startable$errorDuringStarting ||
                new StartingFailedManually();
    }
    async Startable$stopUncaught(err) {
        if (this.readyState === "STARTING" /* STARTING */) {
            this.failStarting();
            await this.start().catch();
        }
        await this.tryStop(err);
    }
    stop(err) {
        const promise = this.Startable$stopUncaught(err);
        promise.catch();
        return promise;
    }
}
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "stop", null);
exports.Startable = Startable;
//# sourceMappingURL=startable.js.map