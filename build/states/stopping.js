"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotTryStartDuringStopping = exports.Stopping = void 0;
const state_1 = require("../state");
const manual_promise_1 = require("manual-promise");
class Stopping extends state_1.State {
    constructor(startable, args) {
        super(startable);
        this.startable = startable;
        this.stoppingPromise = new manual_promise_1.ManualPromise();
        this.manualFailure = null;
        this.startingPromise = args.startingPromise;
        this.onStoppings = args.onStoppings;
        for (const onStopping of this.onStoppings)
            onStopping(args.err);
        this.setup();
    }
    getStartingPromise() {
        return this.startingPromise;
    }
    getStoppingPromise() {
        return this.stoppingPromise;
    }
    async setup() {
        try {
            await this.startable.rawStop();
            if (this.manualFailure)
                throw this.manualFailure;
            this.stoppingPromise.resolve();
        }
        catch (err) {
            this.stoppingPromise.reject(err);
        }
        this.startable.state =
            this.startable.factories.stopped.create({
                stoppingPromise: this.stoppingPromise,
            });
    }
    async tryStart(onStopping) {
        throw new CannotTryStartDuringStopping();
    }
    async start(onStopping) {
        await this.startingPromise;
    }
    async tryStop(err) {
        await this.stoppingPromise;
    }
    async stop(err) {
        await this.tryStop(err);
    }
    async fail(err) {
        this.manualFailure = err;
        await this.stoppingPromise.catch(() => { });
    }
    getReadyState() {
        return "STOPPING" /* STOPPING */;
    }
}
exports.Stopping = Stopping;
(function (Stopping) {
    class Factory {
        constructor(startable) {
            this.startable = startable;
        }
        create(args) {
            return new Stopping(this.startable, args);
        }
    }
    Stopping.Factory = Factory;
})(Stopping = exports.Stopping || (exports.Stopping = {}));
class CannotTryStartDuringStopping extends Error {
    constructor() {
        super('Cannot call .tryStop() during STOPPING.');
    }
}
exports.CannotTryStartDuringStopping = CannotTryStartDuringStopping;
//# sourceMappingURL=stopping.js.map