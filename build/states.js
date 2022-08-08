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
        this.host.state = new Starting(this.host, onStopping || null);
        this.host.state.postActivate();
        await this.host.start();
    }
    async assart(onStopping) {
        throw new CannotAssartDuringReady();
    }
    async stop() {
        this.host.state = new Stopped(this.host, new manual_promise_1.PublicManualPromise(), null, null, null);
        this.host.state.postActivate();
    }
    async starp(err) {
        throw new CannotStarpDuringReady();
    }
    getReadyState() {
        return "READY" /* READY */;
    }
    skipStart(onStopping) {
        this.host.state = new Started(this.host, new manual_promise_1.PublicManualPromise(), onStopping ? [onStopping] : [], null);
        this.host.state.postActivate();
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
        this.startingError = null;
        if (onStopping)
            this.onStoppings.push(onStopping);
    }
    postActivate() {
        this.host.rawStart().catch(err => {
            this.startingError = err;
        }).then(() => {
            this.host.state = new Started(this.host, this.starting, this.onStoppings, this.startingError);
            this.host.state.postActivate();
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
        this.startingError = new StarpCalledDuringStarting();
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
    constructor(host, starting, onStoppings, startingError) {
        super();
        this.host = host;
        this.starting = starting;
        this.onStoppings = onStoppings;
        this.startingError = startingError;
    }
    postActivate() {
        if (this.startingError)
            this.starting.reject(this.startingError);
        else
            this.starting.resolve();
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
    async stop(runningError) {
        this.host.state = new Stopping(this.host, this.starting, this.onStoppings, this.startingError, runningError || null);
        this.host.state.postActivate();
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
    constructor(host, starting, onStoppings, startingError, runningError) {
        super();
        this.host = host;
        this.starting = starting;
        this.onStoppings = onStoppings;
        this.startingError = startingError;
        this.runningError = runningError;
        this.stopping = new manual_promise_1.PublicManualPromise();
    }
    postActivate() {
        if (this.runningError)
            for (const onStopping of this.onStoppings)
                onStopping(this.runningError);
        else
            for (const onStopping of this.onStoppings)
                onStopping();
        (this.runningError
            ? this.host.rawStop(this.runningError)
            : this.host.rawStop()).then(() => {
            this.host.state = new Stopped(this.host, this.stopping, this.startingError, this.runningError, null);
            this.host.state.postActivate();
        }).catch((stoppingError) => {
            this.host.state = new Stopped(this.host, this.stopping, this.startingError, this.runningError, stoppingError);
            ;
            this.host.state.postActivate();
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
    constructor(host, stopping, startingError, runningError, stoppingError) {
        super();
        this.host = host;
        this.stopping = stopping;
        this.startingError = startingError;
        this.runningError = runningError;
        this.stoppingError = stoppingError;
    }
    postActivate() {
        if (this.startingError)
            this.host.reject(this.startingError);
        else if (this.runningError)
            this.host.reject(this.runningError);
        else if (this.stoppingError)
            this.host.reject(this.stoppingError);
        else
            this.host.resolve();
        if (this.stoppingError)
            this.stopping.reject(this.stoppingError);
        else
            this.stopping.resolve();
    }
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