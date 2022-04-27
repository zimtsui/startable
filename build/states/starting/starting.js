"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarpCalledDuringStarting = exports.Starting = void 0;
const state_like_1 = require("../../state-like");
const injektor_1 = require("injektor");
const public_manual_promise_1 = require("../../public-manual-promise");
const friendly_startable_like_1 = require("../../friendly-startable-like");
const starting_like_1 = require("./starting-like");
class Starting {
    constructor(args, startable) {
        this.startable = startable;
        this.startingPromise = public_manual_promise_1.PublicManualPromise.create();
        this.onStoppings = [];
        this.manualFailure = null;
        if (args.onStopping)
            this.onStoppings.push(args.onStopping);
        this.stoppingPromise = args.stoppingPromise;
        this.startable.setState(this);
        this.startable.rawStart().then(() => {
            if (this.manualFailure)
                throw this.manualFailure;
            this.startingPromise.resolve();
        }).catch((err) => {
            this.startingPromise.reject(err);
        }).then(() => {
            this.startable.factories.started.create({
                onStoppings: this.onStoppings,
                startingPromise: this.startingPromise,
            });
        });
    }
    async start(onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.startingPromise;
    }
    async assart(onStopping) {
        await this.start(onStopping);
    }
    async stop(err) {
        await this.stoppingPromise;
    }
    async starp(err) {
        this.manualFailure = new StarpCalledDuringStarting();
        await this.startingPromise.catch(() => { });
        await this.startable.stop(err);
    }
    getReadyState() {
        return "STARTING" /* STARTING */;
    }
    skipStart(onStopping) {
        throw new starting_like_1.CannotSkipStartDuringStarting();
    }
}
exports.Starting = Starting;
(function (Starting) {
    class Factory {
        constructor() {
            this.container = new injektor_1.Container();
        }
        create(args) {
            return new Starting(args, this.startable);
        }
    }
    __decorate([
        (0, injektor_1.instantInject)(friendly_startable_like_1.FriendlyStartableLike)
    ], Factory.prototype, "startable", void 0);
    Starting.Factory = Factory;
})(Starting = exports.Starting || (exports.Starting = {}));
class StarpCalledDuringStarting extends Error {
    constructor() {
        super('.starp() is called during STARTING.');
    }
}
exports.StarpCalledDuringStarting = StarpCalledDuringStarting;
//# sourceMappingURL=starting.js.map