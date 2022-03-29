"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotSkipStartDuringStarting = exports.CannotTryStopDuringStarting = exports.StopCalledDuringStarting = exports.Starting = void 0;
const injektor_1 = require("injektor");
const manual_promise_1 = require("manual-promise");
const friendly_startable_1 = require("../../friendly-startable");
const started_like_1 = require("../started/started-like");
class Starting {
    constructor(args, startable) {
        this.startable = startable;
        this.startingPromise = new manual_promise_1.ManualPromise();
        this.onStoppings = [];
        this.manualFailure = null;
        if (args.onStopping)
            this.onStoppings.push(args.onStopping);
        // https://github.com/microsoft/TypeScript/issues/38929
        this.setup();
    }
    getStartingPromise() {
        return this.startingPromise;
    }
    async setup() {
        try {
            await this.startable.rawStart();
            if (this.manualFailure)
                throw this.manualFailure;
            this.startingPromise.resolve();
        }
        catch (err) {
            this.startingPromise.reject(err);
        }
        const nextState = this.startedFactory.create({
            onStoppings: this.onStoppings,
            startingPromise: this.startingPromise,
        });
        this.startable.setState(nextState);
    }
    async tryStart(onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.startingPromise;
    }
    async start(onStopping) {
        await this.tryStart(onStopping);
    }
    async tryStop(err) {
        throw new CannotTryStopDuringStarting();
    }
    async stop(err) {
        this.fail(new StopCalledDuringStarting());
        await this.startingPromise.catch(() => { });
        await this.startable.stop(err);
    }
    async fail(err) {
        this.manualFailure = err;
        await this.startingPromise.catch(() => { });
    }
    getReadyState() {
        return "STARTING" /* STARTING */;
    }
    skipStart(onStopping) {
        throw new CannotSkipStartDuringStarting();
    }
}
__decorate([
    (0, injektor_1.inject)(started_like_1.StartedLike.FactoryLike)
], Starting.prototype, "startedFactory", void 0);
exports.Starting = Starting;
(function (Starting) {
    class Factory {
        constructor() {
            this.container = new injektor_1.Container();
            this.container.register(started_like_1.StartedLike.FactoryLike, () => this.startedFactory);
            this.container.register(friendly_startable_1.FriendlyStartable, () => this.startable);
        }
        create(args) {
            return this.container.inject(new Starting(args, this.startable));
        }
    }
    __decorate([
        (0, injektor_1.inject)(started_like_1.StartedLike.FactoryLike)
    ], Factory.prototype, "startedFactory", void 0);
    __decorate([
        (0, injektor_1.inject)(friendly_startable_1.FriendlyStartable)
    ], Factory.prototype, "startable", void 0);
    Starting.Factory = Factory;
})(Starting = exports.Starting || (exports.Starting = {}));
class StopCalledDuringStarting extends Error {
    constructor() {
        super('.stop() is called during STARTING.');
    }
}
exports.StopCalledDuringStarting = StopCalledDuringStarting;
class CannotTryStopDuringStarting extends Error {
    constructor() {
        super('Cannot call .tryStop() during STARTING.');
    }
}
exports.CannotTryStopDuringStarting = CannotTryStopDuringStarting;
class CannotSkipStartDuringStarting extends Error {
    constructor() {
        super('Cannot call .skipStart() during STARTING.');
    }
}
exports.CannotSkipStartDuringStarting = CannotSkipStartDuringStarting;
//# sourceMappingURL=starting.js.map