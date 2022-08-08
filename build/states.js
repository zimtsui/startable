"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotGetStartingDuringStopped = exports.CannotAssartDuringStopped = exports.CannotStarpDuringStopped = exports.CannotSkipStartDuringStopped = exports.CannotStartDuringStopped = exports.Stopped = exports.CannotStartDuringStopping = exports.CannotAssartDuringStopping = exports.CannotSkipStartDuringStopping = exports.Stopping = exports.CannotGetStoppingDuringStarted = exports.CannotSkipStartDuringStarted = exports.Started = exports.CannotGetStoppingDuringStarting = exports.CannotStopDuringStarting = exports.CannotSkipStartDuringStarting = exports.StarpCalledDuringStarting = exports.Starting = exports.CannotGetStoppingDuringReady = exports.CannotGetStartingDuringReady = exports.CannotAssartDuringReady = exports.CannotStarpDuringReady = exports.Ready = void 0;
const startable_1 = require("./startable");
const manual_promise_1 = require("@zimtsui/manual-promise");
class Ready extends startable_1.State {
    constructor(host) {
        super();
        this.host = host;
    }
    postActivate() { }
    async start(onStopping) {
        const nextState = new Starting(this.host, onStopping);
        this.host.state = nextState;
        nextState.postActivate();
        await this.host.start();
    }
    async assart(onStopping) {
        throw new CannotAssartDuringReady();
    }
    async stop() {
        const nextState = new Stopped(this.host, Promise.resolve());
        this.host.state = nextState;
        nextState.postActivate();
    }
    async starp(err) {
        throw new CannotStarpDuringReady();
    }
    getReadyState() {
        return "READY" /* READY */;
    }
    skipStart(onStopping) {
        const nextState = new Started(this.host, Promise.resolve(), onStopping ? [onStopping] : []);
        this.host.state = nextState;
        nextState.postActivate();
    }
    getStarting() {
        throw new CannotGetStartingDuringReady();
    }
    getStopping() {
        throw new CannotGetStoppingDuringReady();
    }
}
exports.Ready = Ready;
class CannotStarpDuringReady extends Error {
}
exports.CannotStarpDuringReady = CannotStarpDuringReady;
class CannotAssartDuringReady extends Error {
}
exports.CannotAssartDuringReady = CannotAssartDuringReady;
class CannotGetStartingDuringReady extends Error {
}
exports.CannotGetStartingDuringReady = CannotGetStartingDuringReady;
class CannotGetStoppingDuringReady extends Error {
}
exports.CannotGetStoppingDuringReady = CannotGetStoppingDuringReady;
class Starting extends startable_1.State {
    constructor(host, onStopping) {
        super();
        this.host = host;
        this.starting = new manual_promise_1.PublicManualPromise();
        this.onStoppings = [];
        this.err = null;
        this.starting.catch(() => { });
        if (onStopping)
            this.onStoppings.push(onStopping);
    }
    postActivate() {
        this.host.rawStart().then(() => {
            if (this.err)
                throw this.err;
            this.starting.resolve();
        }).catch((err) => {
            this.starting.reject(err);
        }).then(() => {
            const nextState = new Started(this.host, this.starting, this.onStoppings);
            this.host.state = nextState;
            nextState.postActivate();
        });
    }
    async start(onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.starting;
    }
    async assart(onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.starting;
    }
    async stop(err) {
        throw new CannotStopDuringStarting();
    }
    async starp(err) {
        this.err = new StarpCalledDuringStarting();
        await this.starting.catch(() => { });
        await this.host.stop(err);
    }
    getReadyState() {
        return "STARTING" /* STARTING */;
    }
    skipStart(onStopping) {
        throw new CannotSkipStartDuringStarting();
    }
    getStarting() {
        return this.starting;
    }
    getStopping() {
        throw new CannotGetStoppingDuringStarting();
    }
}
exports.Starting = Starting;
class StarpCalledDuringStarting extends Error {
}
exports.StarpCalledDuringStarting = StarpCalledDuringStarting;
class CannotSkipStartDuringStarting extends Error {
}
exports.CannotSkipStartDuringStarting = CannotSkipStartDuringStarting;
class CannotStopDuringStarting extends Error {
}
exports.CannotStopDuringStarting = CannotStopDuringStarting;
class CannotGetStoppingDuringStarting extends Error {
}
exports.CannotGetStoppingDuringStarting = CannotGetStoppingDuringStarting;
class Started extends startable_1.State {
    constructor(host, starting, onStoppings) {
        super();
        this.host = host;
        this.starting = starting;
        this.onStoppings = onStoppings;
    }
    postActivate() { }
    async start(onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.starting;
    }
    async assart(onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.starting;
    }
    async stop(err) {
        const nextState = new Stopping(this.host, this.starting, this.onStoppings, err);
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
    getStarting() {
        return this.starting;
    }
    getStopping() {
        throw new CannotGetStoppingDuringStarted();
    }
}
exports.Started = Started;
class CannotSkipStartDuringStarted extends Error {
}
exports.CannotSkipStartDuringStarted = CannotSkipStartDuringStarted;
class CannotGetStoppingDuringStarted extends Error {
}
exports.CannotGetStoppingDuringStarted = CannotGetStoppingDuringStarted;
class Stopping extends startable_1.State {
    constructor(host, starting, onStoppings, err) {
        super();
        this.host = host;
        this.starting = starting;
        this.onStoppings = onStoppings;
        this.err = err;
        this.stopping = new manual_promise_1.PublicManualPromise();
    }
    postActivate() {
        for (const onStopping of this.onStoppings)
            onStopping(this.err);
        this.host.rawStop(this.err).then(() => {
            this.stopping.resolve();
        }).catch((err) => {
            this.stopping.reject(err);
        }).then(() => {
            const nextState = new Stopped(this.host, this.stopping);
            this.host.state = nextState;
            nextState.postActivate();
        });
    }
    async start(onStopping) {
        throw new CannotStartDuringStopping();
    }
    async assart(onStopping) {
        throw new CannotAssartDuringStopping();
    }
    async stop(err) {
        await this.stopping;
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
    getStarting() {
        return this.starting;
    }
    getStopping() {
        return this.stopping;
    }
}
exports.Stopping = Stopping;
class CannotSkipStartDuringStopping extends Error {
}
exports.CannotSkipStartDuringStopping = CannotSkipStartDuringStopping;
class CannotAssartDuringStopping extends Error {
}
exports.CannotAssartDuringStopping = CannotAssartDuringStopping;
class CannotStartDuringStopping extends Error {
}
exports.CannotStartDuringStopping = CannotStartDuringStopping;
class Stopped extends startable_1.State {
    constructor(host, stopping) {
        super();
        this.host = host;
        this.stopping = stopping;
    }
    postActivate() { }
    async start(onStopping) {
        throw new CannotStartDuringStopped();
    }
    async assart(onStopping) {
        throw new CannotAssartDuringStopped();
    }
    async stop() {
        await this.stopping;
    }
    async starp(err) {
        throw new CannotStarpDuringStopped();
    }
    getReadyState() {
        return "STOPPED" /* STOPPED */;
    }
    skipStart(onStopping) {
        throw new CannotSkipStartDuringStopped();
    }
    getStarting() {
        throw new CannotGetStartingDuringStopped();
    }
    getStopping() {
        return this.stopping;
    }
}
exports.Stopped = Stopped;
class CannotStartDuringStopped extends Error {
}
exports.CannotStartDuringStopped = CannotStartDuringStopped;
class CannotSkipStartDuringStopped extends Error {
}
exports.CannotSkipStartDuringStopped = CannotSkipStartDuringStopped;
class CannotStarpDuringStopped extends Error {
}
exports.CannotStarpDuringStopped = CannotStarpDuringStopped;
class CannotAssartDuringStopped extends Error {
}
exports.CannotAssartDuringStopped = CannotAssartDuringStopped;
class CannotGetStartingDuringStopped extends Error {
}
exports.CannotGetStartingDuringStopped = CannotGetStartingDuringStopped;
//# sourceMappingURL=states.js.map