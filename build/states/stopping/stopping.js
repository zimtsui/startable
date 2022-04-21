"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stopping = void 0;
const state_like_1 = require("../../state-like");
const public_manual_promise_1 = require("../../public-manual-promise");
const friendly_startable_like_1 = require("../../friendly-startable-like");
const stopping_like_1 = require("./stopping-like");
const injektor_1 = require("injektor");
class Stopping {
    constructor(args, startable) {
        this.startable = startable;
        this.stoppingPromise = public_manual_promise_1.PublicManualPromise.create();
        this.startingPromise = args.startingPromise;
        this.onStoppings = args.onStoppings;
        for (const onStopping of this.onStoppings)
            onStopping(args.err);
        this.setup();
    }
    async setup() {
        try {
            await this.startable.rawStop();
            this.stoppingPromise.resolve();
        }
        catch (err) {
            this.stoppingPromise.reject(err);
        }
        const nextState = this.startable.factories.stopped.create({
            stoppingPromise: this.stoppingPromise,
        });
        this.startable.setState(nextState);
    }
    async start(onStopping) {
        await this.startingPromise;
    }
    async assart(onStopping) {
        throw new stopping_like_1.CannotAssartDuringStopping();
    }
    async stop(err) {
        await this.stoppingPromise;
    }
    async starp(err) {
        await this.stop(err);
    }
    getReadyState() {
        return "STOPPING" /* STOPPING */;
    }
    skipStart(onStopping) {
        throw new stopping_like_1.CannotSkipStartDuringStopping();
    }
}
exports.Stopping = Stopping;
(function (Stopping) {
    class Factory {
        constructor() {
            this.container = new injektor_1.Container();
        }
        create(args) {
            return new Stopping(args, this.startable);
        }
    }
    __decorate([
        (0, injektor_1.instantInject)(friendly_startable_like_1.FriendlyStartableLike)
    ], Factory.prototype, "startable", void 0);
    Stopping.Factory = Factory;
})(Stopping = exports.Stopping || (exports.Stopping = {}));
//# sourceMappingURL=stopping.js.map