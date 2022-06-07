"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotSkipStartDuringStarted = exports.Started = void 0;
const state_like_1 = require("../../state-like");
class Started {
    constructor(args, startable, factories) {
        this.startable = startable;
        this.factories = factories;
        this.startingPromise = args.startingPromise;
        this.onStoppings = args.onStoppings;
        this.startable.setState(this);
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
        this.factories.stopping.create({
            startingPromise: this.startingPromise,
            onStoppings: this.onStoppings,
            err,
        });
        await this.startable.stop();
    }
    async starp(err) {
        await this.stop(err);
    }
    getReadyState() {
        return "STARTED" /* STARTED */;
    }
    skipStart(onStopping) {
        throw new CannotSkipStartDuringStarted();
    }
}
exports.Started = Started;
class CannotSkipStartDuringStarted extends Error {
    constructor() {
        super('Cannot call .skipStart() during STARTED.');
    }
}
exports.CannotSkipStartDuringStarted = CannotSkipStartDuringStarted;
//# sourceMappingURL=state.js.map