"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotSkipStartDuringStarting = exports.StarpCalledDuringStarting = exports.Starting = void 0;
const state_like_1 = require("../../state-like");
const public_manual_promise_1 = require("../../public-manual-promise");
class Starting {
    constructor(args, startable, factories) {
        this.startable = startable;
        this.factories = factories;
        this.startingPromise = public_manual_promise_1.PublicManualPromise.create();
        this.onStoppings = [];
        this.manualFailure = null;
        if (args.onStopping)
            this.onStoppings.push(args.onStopping);
        this.stoppingPromise = args.stoppingPromise;
    }
    postActivate() {
        this.startable.rawStart().then(() => {
            if (this.manualFailure)
                throw this.manualFailure;
            this.startingPromise.resolve();
        }).catch((err) => {
            this.startingPromise.reject(err);
        }).then(() => {
            const nextState = this.factories.started.create({
                onStoppings: this.onStoppings,
                startingPromise: this.startingPromise,
            });
            this.startable.setState(nextState);
            nextState.postActivate();
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
        throw new CannotSkipStartDuringStarting();
    }
}
exports.Starting = Starting;
class StarpCalledDuringStarting extends Error {
    constructor() {
        super('.starp() is called during STARTING.');
    }
}
exports.StarpCalledDuringStarting = StarpCalledDuringStarting;
class CannotSkipStartDuringStarting extends Error {
    constructor() {
        super('Cannot call .skipStart() during STARTING.');
    }
}
exports.CannotSkipStartDuringStarting = CannotSkipStartDuringStarting;
//# sourceMappingURL=state.js.map