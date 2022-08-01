"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotSkipStartDuringStarted = exports.Started = void 0;
const startable_1 = require("../../startable");
class Started extends startable_1.State {
    constructor(args, host, factories) {
        super();
        this.host = host;
        this.factories = factories;
        this.startingPromise = args.startingPromise;
        this.onStoppings = args.onStoppings;
    }
    postActivate() { }
    async start(startArgs, onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.startingPromise;
    }
    async assart(onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.startingPromise;
    }
    async stop(err) {
        const nextState = this.factories.stopping.create(this.host, {
            startingPromise: this.startingPromise,
            onStoppings: this.onStoppings,
            err,
        });
        this.host.state = nextState;
        nextState.postActivate();
        await this.host.stop();
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