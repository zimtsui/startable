"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotFailDuringStopped = exports.Stopped = void 0;
const injektor_1 = require("injektor");
const starting_like_1 = require("../starting/starting-like");
const started_like_1 = require("../started/started-like");
const friendly_startable_1 = require("../../friendly-startable");
class Stopped {
    constructor(args, startable) {
        this.startable = startable;
        this.stoppingPromise = args.stoppingPromise;
    }
    getStoppingPromise() {
        return this.stoppingPromise;
    }
    async tryStart(onStopping) {
        const nextState = this.startingFactory.create({
            onStopping,
        });
        this.startable.setState(nextState);
        await nextState.getStartingPromise();
    }
    async start(onStopping) {
        await this.tryStart(onStopping);
    }
    async tryStop(err) {
        await this.stoppingPromise;
    }
    async stop() {
        await this.tryStop();
    }
    async fail(err) {
        throw new CannotFailDuringStopped();
    }
    getReadyState() {
        return "STOPPED" /* STOPPED */;
    }
    skipStart(onStopping) {
        const nextState = this.startedFactory.create({
            startingPromise: Promise.resolve(),
            onStoppings: onStopping ? [onStopping] : [],
        });
        this.startable.setState(nextState);
    }
}
__decorate([
    (0, injektor_1.inject)(starting_like_1.StartingLike.FactoryLike)
], Stopped.prototype, "startingFactory", void 0);
__decorate([
    (0, injektor_1.inject)(started_like_1.StartedLike.FactoryLike)
], Stopped.prototype, "startedFactory", void 0);
exports.Stopped = Stopped;
(function (Stopped) {
    class Factory {
        constructor() {
            this.container = new injektor_1.Container();
            this.container.register(starting_like_1.StartingLike.FactoryLike, () => this.startingFactory);
            this.container.register(started_like_1.StartedLike.FactoryLike, () => this.startedFactory);
            this.container.register(friendly_startable_1.FriendlyStartable, () => this.startable);
        }
        create(args) {
            return this.container.inject(new Stopped(args, this.startable));
        }
    }
    __decorate([
        (0, injektor_1.inject)(starting_like_1.StartingLike.FactoryLike)
    ], Factory.prototype, "startingFactory", void 0);
    __decorate([
        (0, injektor_1.inject)(started_like_1.StartedLike.FactoryLike)
    ], Factory.prototype, "startedFactory", void 0);
    __decorate([
        (0, injektor_1.inject)(friendly_startable_1.FriendlyStartable)
    ], Factory.prototype, "startable", void 0);
    Stopped.Factory = Factory;
})(Stopped = exports.Stopped || (exports.Stopped = {}));
class CannotFailDuringStopped extends Error {
    constructor() {
        super('Cannot call .fail() during STOPPED.');
    }
}
exports.CannotFailDuringStopped = CannotFailDuringStopped;
//# sourceMappingURL=stopped.js.map