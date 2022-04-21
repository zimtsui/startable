"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stopped = void 0;
const state_like_1 = require("../../state-like");
const stopped_like_1 = require("./stopped-like");
const injektor_1 = require("injektor");
const friendly_startable_like_1 = require("../../friendly-startable-like");
class Stopped {
    constructor(args, startable) {
        this.startable = startable;
        this.stoppingPromise = args.stoppingPromise;
    }
    async start(onStopping) {
        const nextState = this.startable.factories.starting.create({
            onStopping,
            stoppingPromise: this.stoppingPromise,
        });
        this.startable.setState(nextState);
        await this.startable.start();
    }
    async assart(onStopping) {
        throw new stopped_like_1.CannotAssartDuringStopped();
    }
    async stop() {
        await this.stoppingPromise;
    }
    async starp(err) {
        throw new stopped_like_1.CannotStarpDuringStopped();
    }
    getReadyState() {
        return "STOPPED" /* STOPPED */;
    }
    skipStart(onStopping) {
        const nextState = this.startable.factories.started.create({
            startingPromise: Promise.resolve(),
            onStoppings: onStopping ? [onStopping] : [],
        });
        this.startable.setState(nextState);
    }
}
exports.Stopped = Stopped;
(function (Stopped) {
    class Factory {
        constructor() {
            this.container = new injektor_1.Container();
        }
        create(args) {
            return new Stopped(args, this.startable);
        }
    }
    __decorate([
        (0, injektor_1.instantInject)(friendly_startable_like_1.FriendlyStartableLike)
    ], Factory.prototype, "startable", void 0);
    Stopped.Factory = Factory;
})(Stopped = exports.Stopped || (exports.Stopped = {}));
//# sourceMappingURL=stopped.js.map