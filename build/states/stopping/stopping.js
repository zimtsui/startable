"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotSkipStartDuringStopping = exports.CannotTryStartDuringStopping = exports.Stopping = void 0;
const friendly_startable_1 = require("../../friendly-startable");
const manual_promise_1 = require("manual-promise");
const injektor_1 = require("injektor");
class Stopping {
    constructor(args, startable) {
        this.startable = startable;
        this.stoppingPromise = new manual_promise_1.ManualPromise();
        this.manualFailure = null;
        this.startingPromise = args.startingPromise;
        this.onStoppings = args.onStoppings;
        for (const onStopping of this.onStoppings)
            onStopping(args.err);
        this.setup();
    }
    getStartingPromise() {
        return this.startingPromise;
    }
    getStoppingPromise() {
        return this.stoppingPromise;
    }
    async setup() {
        try {
            await this.startable.rawStop();
            if (this.manualFailure)
                throw this.manualFailure;
            this.stoppingPromise.resolve();
        }
        catch (err) {
            this.stoppingPromise.reject(err);
        }
        const nextState = this.factories.stopped.create({
            stoppingPromise: this.stoppingPromise,
        });
        this.startable.setState(nextState);
    }
    async tryStart(onStopping) {
        throw new CannotTryStartDuringStopping();
    }
    async start(onStopping) {
        await this.startingPromise;
    }
    async tryStop(err) {
        await this.stoppingPromise;
    }
    async stop(err) {
        await this.tryStop(err);
    }
    async fail(err) {
        this.manualFailure = err;
        await this.stoppingPromise.catch(() => { });
    }
    getReadyState() {
        return "STOPPING" /* STOPPING */;
    }
    skipStart(onStopping) {
        throw new CannotSkipStartDuringStopping();
    }
}
Stopping.FactoryDeps = {};
__decorate([
    (0, injektor_1.inject)(Stopping.FactoryDeps)
], Stopping.prototype, "factories", void 0);
exports.Stopping = Stopping;
(function (Stopping) {
    class Factory {
        constructor() {
            this.container = new injektor_1.Container();
            this.container.register(friendly_startable_1.FriendlyStartable, () => this.startable);
            this.container.register(Stopping.FactoryDeps, () => this.factories);
        }
        create(args) {
            return this.container.inject(new Stopping(args, this.startable));
        }
    }
    __decorate([
        (0, injektor_1.inject)(Stopping.FactoryDeps)
    ], Factory.prototype, "factories", void 0);
    __decorate([
        (0, injektor_1.inject)(friendly_startable_1.FriendlyStartable)
    ], Factory.prototype, "startable", void 0);
    Stopping.Factory = Factory;
})(Stopping = exports.Stopping || (exports.Stopping = {}));
class CannotTryStartDuringStopping extends Error {
    constructor() {
        super('Cannot call .tryStop() during STOPPING.');
    }
}
exports.CannotTryStartDuringStopping = CannotTryStartDuringStopping;
class CannotSkipStartDuringStopping extends Error {
    constructor() {
        super('Cannot call .skipStart() during STOPPING.');
    }
}
exports.CannotSkipStartDuringStopping = CannotSkipStartDuringStopping;
//# sourceMappingURL=stopping.js.map