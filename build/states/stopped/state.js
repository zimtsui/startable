"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotAssartDuringStopped = exports.CannotStarpDuringStopped = exports.Stopped = void 0;
const state_like_1 = require("../../state-like");
class Stopped {
    constructor(args, startable, factories) {
        this.startable = startable;
        this.factories = factories;
        this.stoppingPromise = args.stoppingPromise;
    }
    postActivate() { }
    async start(onStopping) {
        const nextState = this.factories.starting.create({
            onStopping,
            stoppingPromise: this.stoppingPromise,
        });
        this.startable.setState(nextState);
        nextState.postActivate();
        await this.startable.start();
    }
    async assart(onStopping) {
        throw new CannotAssartDuringStopped();
    }
    async stop() {
        await this.stoppingPromise;
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
        nextState.postActivate();
    }
}
exports.Stopped = Stopped;
class CannotStarpDuringStopped extends Error {
    constructor() {
        super('Cannot call .starp() during STOPPED.');
    }
}
exports.CannotStarpDuringStopped = CannotStarpDuringStopped;
class CannotAssartDuringStopped extends Error {
    constructor() {
        super('Cannot call .assart() during STOPPED.');
    }
}
exports.CannotAssartDuringStopped = CannotAssartDuringStopped;
//# sourceMappingURL=state.js.map