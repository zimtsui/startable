"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Started = void 0;
const state_like_1 = require("../../state-like");
const friendly_startable_like_1 = require("../../friendly-startable-like");
const injektor_1 = require("injektor");
const started_like_1 = require("./started-like");
class Started {
    constructor(args, startable) {
        this.startable = startable;
        this.startingPromise = args.startingPromise;
        this.onStoppings = args.onStoppings;
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
        const nextState = this.startable.factories.stopping.create({
            startingPromise: this.startingPromise,
            onStoppings: this.onStoppings,
            err,
        });
        this.startable.setState(nextState);
        await this.startable.stop();
    }
    async starp(err) {
        await this.stop(err);
    }
    getReadyState() {
        return "STARTED" /* STARTED */;
    }
    skipStart(onStopping) {
        throw new started_like_1.CannotSkipStartDuringStarted();
    }
}
exports.Started = Started;
(function (Started) {
    class Factory {
        constructor() {
            this.container = new injektor_1.Container();
        }
        create(args) {
            return new Started(args, this.startable);
        }
    }
    __decorate([
        (0, injektor_1.instantInject)(friendly_startable_like_1.FriendlyStartableLike)
    ], Factory.prototype, "startable", void 0);
    Started.Factory = Factory;
})(Started = exports.Started || (exports.Started = {}));
//# sourceMappingURL=started.js.map