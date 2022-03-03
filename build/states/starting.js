"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotSkipStartDuringStarting = exports.CannotTryStopDuringStarting = exports.StopCalledDuringStarting = exports.Starting = void 0;
const state_1 = require("../state");
const manual_promise_1 = require("manual-promise");
class Starting extends state_1.State {
    constructor(startable, args) {
        super(startable);
        this.startable = startable;
        this.startingPromise = new manual_promise_1.ManualPromise();
        this.onStoppings = [];
        this.manualFailure = null;
        if (args.onStopping)
            this.onStoppings.push(args.onStopping);
        // https://github.com/microsoft/TypeScript/issues/38929
        this.setup();
    }
    getStartingPromise() {
        return this.startingPromise;
    }
    async setup() {
        try {
            await this.startable.rawStart();
            if (this.manualFailure)
                throw this.manualFailure;
            this.startingPromise.resolve();
        }
        catch (err) {
            this.startingPromise.reject(err);
        }
        this.startable.state =
            this.startable.factories.started.create({
                onStoppings: this.onStoppings,
                startingPromise: this.startingPromise,
            });
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
        throw new CannotTryStopDuringStarting();
    }
    async stop(err) {
        this.fail(new StopCalledDuringStarting());
        await this.startingPromise.catch(() => { });
        await this.startable.stop(err);
    }
    async fail(err) {
        this.manualFailure = err;
        await this.startingPromise.catch(() => { });
    }
    getReadyState() {
        return "STARTING" /* STARTING */;
    }
    skipStart(onStopping) {
        throw new CannotSkipStartDuringStarting();
    }
}
exports.Starting = Starting;
(function (Starting) {
    class Factory {
        constructor(startable) {
            this.startable = startable;
        }
        create(args) {
            return new Starting(this.startable, args);
        }
    }
    Starting.Factory = Factory;
})(Starting = exports.Starting || (exports.Starting = {}));
class StopCalledDuringStarting extends Error {
    constructor() {
        super('.stop() is called during STARTING.');
    }
}
exports.StopCalledDuringStarting = StopCalledDuringStarting;
class CannotTryStopDuringStarting extends Error {
    constructor() {
        super('Cannot call .tryStop() during STARTING.');
    }
}
exports.CannotTryStopDuringStarting = CannotTryStopDuringStarting;
class CannotSkipStartDuringStarting extends state_1.CannotSkipStart {
    constructor() {
        super('Cannot call .skipStart() during STARTING.');
    }
}
exports.CannotSkipStartDuringStarting = CannotSkipStartDuringStarting;
//# sourceMappingURL=starting.js.map