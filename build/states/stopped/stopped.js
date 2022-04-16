"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotStarpDuringStopped = exports.Stopped = void 0;
const stopped_like_1 = require("./stopped-like");
const injektor_1 = require("injektor");
const friendly_startable_like_1 = require("../../friendly-startable-like");
class Stopped {
    constructor(args, startable) {
        this.startable = startable;
        this.stoppingPromise = args.stoppingPromise;
    }
    getStoppingPromise() {
        return this.stoppingPromise;
    }
    async start(onStopping) {
        const nextState = this.factories.starting.create({
            onStopping,
            stoppingPromise: this.stoppingPromise,
        });
        this.startable.setState(nextState);
        await this.startable.start();
    }
    async stop() {
        throw new stopped_like_1.CannotStopDuringStopped();
    }
    async starp(err) {
        throw new CannotStarpDuringStopped();
    }
    getReadyState() {
        return "STOPPED" /* STOPPED */;
    }
    skipStart(onStopping) {
        const nextState = this.factories.started.create({
            startingPromise: Promise.resolve(),
            onStoppings: onStopping ? [onStopping] : [],
        });
        this.startable.setState(nextState);
    }
}
Stopped.FactoryDeps = {};
__decorate([
    (0, injektor_1.inject)(Stopped.FactoryDeps)
], Stopped.prototype, "factories", void 0);
exports.Stopped = Stopped;
(function (Stopped) {
    class Factory {
        constructor() {
            this.container = new injektor_1.Container();
            this.container.register(Stopped.FactoryDeps, () => this.factories);
            this.container.register(friendly_startable_like_1.FriendlyStartableLike, () => this.startable);
        }
        create(args) {
            return this.container.inject(new Stopped(args, this.startable));
        }
    }
    __decorate([
        (0, injektor_1.inject)(Stopped.FactoryDeps)
    ], Factory.prototype, "factories", void 0);
    __decorate([
        (0, injektor_1.inject)(friendly_startable_like_1.FriendlyStartableLike)
    ], Factory.prototype, "startable", void 0);
    Stopped.Factory = Factory;
})(Stopped = exports.Stopped || (exports.Stopped = {}));
class CannotStarpDuringStopped extends Error {
    constructor() {
        super('Cannot call .starp() during STOPPED.');
    }
}
exports.CannotStarpDuringStopped = CannotStarpDuringStopped;
//# sourceMappingURL=stopped.js.map