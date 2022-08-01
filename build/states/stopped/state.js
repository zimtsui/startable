"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotGetStartingDuringStopped = exports.CannotAssartDuringStopped = exports.CannotStarpDuringStopped = exports.Stopped = void 0;
const startable_1 = require("../../startable");
class Stopped extends startable_1.State {
    constructor(args, host, factories) {
        super();
        this.host = host;
        this.factories = factories;
        this.stoppingPromise = args.stoppingPromise;
    }
    postActivate() { }
    async start(startArgs, onStopping) {
        const nextState = this.factories.starting.create(this.host, {
            onStopping,
            stoppingPromise: this.stoppingPromise,
            startArgs,
        });
        this.host.state = nextState;
        nextState.postActivate();
        await this.host.start(startArgs);
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
        const nextState = this.factories.started.create(this.host, {
            startingPromise: Promise.resolve(),
            onStoppings: onStopping ? [onStopping] : [],
        });
        this.host.state = nextState;
        nextState.postActivate();
    }
    getStarting() {
        throw new CannotGetStartingDuringStopped();
    }
    getStopping() {
        return this.stoppingPromise;
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
class CannotGetStartingDuringStopped extends Error {
}
exports.CannotGetStartingDuringStopped = CannotGetStartingDuringStopped;
//# sourceMappingURL=state.js.map