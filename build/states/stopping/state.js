"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotAssartDuringStopping = exports.CannotSkipStartDuringStopping = exports.Stopping = void 0;
const state_like_1 = require("../../state-like");
const public_manual_promise_1 = require("../../public-manual-promise");
class Stopping {
    constructor(args, startable, factories) {
        this.startable = startable;
        this.factories = factories;
        this.stoppingPromise = public_manual_promise_1.PublicManualPromise.create();
        this.startingPromise = args.startingPromise;
        this.onStoppings = args.onStoppings;
        this.startable.setState(this);
        for (const onStopping of this.onStoppings)
            onStopping(args.err);
        this.startable.rawStop(args.err).then(() => {
            this.stoppingPromise.resolve();
        }).catch((err) => {
            this.stoppingPromise.reject(err);
        }).then(() => {
            this.factories.stopped.create({
                stoppingPromise: this.stoppingPromise,
            });
        });
    }
    async start(onStopping) {
        await this.startingPromise;
    }
    async assart(onStopping) {
        throw new CannotAssartDuringStopping();
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
        throw new CannotSkipStartDuringStopping();
    }
}
exports.Stopping = Stopping;
class CannotSkipStartDuringStopping extends Error {
    constructor() {
        super('Cannot call .skipStart() during STOPPING.');
    }
}
exports.CannotSkipStartDuringStopping = CannotSkipStartDuringStopping;
class CannotAssartDuringStopping extends Error {
    constructor() {
        super('Cannot call .assart() during STOPPING.');
    }
}
exports.CannotAssartDuringStopping = CannotAssartDuringStopping;
//# sourceMappingURL=state.js.map