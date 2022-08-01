"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotAssartDuringStopping = exports.CannotSkipStartDuringStopping = exports.Stopping = void 0;
const startable_1 = require("../../startable");
const public_manual_promise_1 = require("../../public-manual-promise");
class Stopping extends startable_1.State {
    constructor(args, host, factories) {
        super();
        this.args = args;
        this.host = host;
        this.factories = factories;
        this.stoppingPromise = public_manual_promise_1.PublicManualPromise.create();
        this.startingPromise = args.startingPromise;
        this.onStoppings = args.onStoppings;
    }
    postActivate() {
        for (const onStopping of this.onStoppings)
            onStopping(this.args.err);
        this.host.rawStop(this.args.err).then(() => {
            this.stoppingPromise.resolve();
        }).catch((err) => {
            this.stoppingPromise.reject(err);
        }).then(() => {
            const nextState = this.factories.stopped.create(this.host, {
                stoppingPromise: this.stoppingPromise,
            });
            this.host.state = nextState;
            nextState.postActivate();
        });
    }
    async start(startArgs, onStopping) {
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