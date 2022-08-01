"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotSkipStartDuringStarting = exports.StarpCalledDuringStarting = exports.Starting = void 0;
const startable_1 = require("../../startable");
const public_manual_promise_1 = require("../../public-manual-promise");
class Starting extends startable_1.State {
    constructor(args, host, factories) {
        super();
        this.host = host;
        this.factories = factories;
        this.startingPromise = public_manual_promise_1.PublicManualPromise.create();
        this.onStoppings = [];
        this.manualFailure = null;
        if (args.onStopping)
            this.onStoppings.push(args.onStopping);
        this.stoppingPromise = args.stoppingPromise;
        this.startArgs = args.startArgs;
    }
    postActivate() {
        this.host.rawStart(...this.startArgs).then(() => {
            if (this.manualFailure)
                throw this.manualFailure;
            this.startingPromise.resolve();
        }).catch((err) => {
            this.startingPromise.reject(err);
        }).then(() => {
            const nextState = this.factories.started.create(this.host, {
                onStoppings: this.onStoppings,
                startingPromise: this.startingPromise,
            });
            this.host.state = nextState;
            nextState.postActivate();
        });
    }
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
        await this.stoppingPromise;
    }
    async starp(err) {
        this.manualFailure = new StarpCalledDuringStarting();
        await this.startingPromise.catch(() => { });
        await this.host.stop(err);
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