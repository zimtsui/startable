"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotFailDuringStopped = exports.Stopped = void 0;
const state_1 = require("../state");
class Stopped extends state_1.State {
    constructor(startable, args) {
        super(startable);
        this.startable = startable;
        this.stoppingPromise = args.stoppingPromise;
    }
    getStoppingPromise() {
        return this.stoppingPromise;
    }
    async tryStart(onStopping) {
        const nextState = this.startable.factories.starting.create({
            onStopping,
        });
        this.startable.state = nextState;
        await nextState.getStartingPromise();
    }
    async start(onStopping) {
        await this.tryStart(onStopping);
    }
    async tryStop(err) {
        await this.stoppingPromise;
    }
    async stop() {
        await this.tryStop();
    }
    async fail(err) {
        throw new CannotFailDuringStopped();
    }
    getReadyState() {
        return "STOPPED" /* STOPPED */;
    }
}
exports.Stopped = Stopped;
(function (Stopped) {
    class Factory {
        constructor(startable) {
            this.startable = startable;
        }
        create(args) {
            return new Stopped(this.startable, args);
        }
    }
    Stopped.Factory = Factory;
})(Stopped = exports.Stopped || (exports.Stopped = {}));
class CannotFailDuringStopped extends state_1.CannotFail {
    constructor() {
        super('Cannot call .fail() during STOPPED.');
    }
}
exports.CannotFailDuringStopped = CannotFailDuringStopped;
//# sourceMappingURL=stopped.js.map