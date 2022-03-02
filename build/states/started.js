"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotFailDuringStarted = exports.Started = void 0;
const state_1 = require("../state");
class Started extends state_1.State {
    constructor(startable, args) {
        super(startable);
        this.startable = startable;
        this.startingPromise = args.startingPromise;
        this.onStoppings = args.onStoppings;
    }
    getStartingPromise() {
        return this.startingPromise;
    }
    async tryStart(onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.startingPromise;
    }
    async start(onStopping) {
        await this.tryStart(onStopping);
    }
    async tryStop(err) {
        const nextState = this.startable.factories.stopping.create({
            startingPromise: this.startingPromise,
            onStoppings: this.onStoppings,
            err,
        });
        this.startable.state = nextState;
        await nextState.getStoppingPromise();
    }
    async stop(err) {
        await this.tryStop(err);
    }
    async fail(err) {
        throw new CannotFailDuringStarted();
    }
    getReadyState() {
        return "STARTED" /* STARTED */;
    }
}
exports.Started = Started;
(function (Started) {
    class Factory {
        constructor(startable) {
            this.startable = startable;
        }
        create(args) {
            return new Started(this.startable, args);
        }
    }
    Started.Factory = Factory;
})(Started = exports.Started || (exports.Started = {}));
class CannotFailDuringStarted extends state_1.CannotFail {
    constructor() {
        super('Cannot call .fail() during STARTED.');
    }
}
exports.CannotFailDuringStarted = CannotFailDuringStarted;
//# sourceMappingURL=started.js.map