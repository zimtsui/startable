"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotAssartDuringStopped = exports.CannotStarpDuringStopped = exports.CannotSkipStartDuringStopped = exports.CannotStartDuringStopped = exports.Stopped = exports.CannotStartDuringStopping = exports.CannotAssartDuringStopping = exports.CannotSkipStartDuringStopping = exports.Stopping = exports.CannotGetStoppingDuringStarted = exports.CannotSkipStartDuringStarted = exports.Started = exports.CannotGetStoppingDuringStarting = exports.CannotStopDuringStarting = exports.CannotSkipStartDuringStarting = exports.StarpCalledDuringStarting = exports.CannotGetRunningDuringStarting = exports.Starting = exports.CannotGetStoppingDuringReady = exports.CannotGetStartingDuringReady = exports.CannotAssartDuringReady = exports.CannotStarpDuringReady = exports.CannotGetRunningDuringReady = exports.Ready = void 0;
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
        this.host.state = new Stopped(this.host, Promise.resolve(), Promise.resolve(), new manual_promise_1.ManualPromise(), 
        // null,
        // null,
        null);
        this.host.state.postActivate();
    }
    async starp(err) {
        throw new CannotStarpDuringReady();
    }
    getReadyState() {
        return "READY" /* READY */;
    }
    skipStart(onStopping) {
        this.host.state = new Started(this.host, new manual_promise_1.ManualPromise(), onStopping ? [onStopping] : [], null);
        this.host.state.postActivate();
    }
    getStarting() {
        throw new CannotGetStartingDuringReady();
    }
    getStopping() {
        throw new CannotGetStoppingDuringReady();
    }
    getRunning() {
        throw new CannotGetRunningDuringReady();
    }
}
exports.Ready = Ready;
class CannotGetRunningDuringReady extends Error {
}
exports.CannotGetRunningDuringReady = CannotGetRunningDuringReady;
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
        this.starting = new manual_promise_1.ManualPromise();
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
    getRunning() {
        throw new CannotGetRunningDuringStarting();
    }
}
exports.Starting = Starting;
class CannotGetRunningDuringStarting extends Error {
}
exports.CannotGetRunningDuringStarting = CannotGetRunningDuringStarting;
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
        this.running = new Promise((resolve, reject) => {
            this.start(err => {
                if (err)
                    reject(err);
                else
                    resolve();
            }).catch(() => { });
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
    async stop(runningError) {
        this.host.state = new Stopping(this.host, this.starting, this.running, this.onStoppings, 
        // this.startingError,
        runningError || null);
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
    getRunning() {
        return this.running;
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
    constructor(host, starting, running, onStoppings, 
    // private startingError: Error | null,
    runningError) {
        super();
        this.host = host;
        this.starting = starting;
        this.running = running;
        this.onStoppings = onStoppings;
        this.runningError = runningError;
        this.stopping = new manual_promise_1.ManualPromise();
        this.stoppingError = null;
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
            : this.host.rawStop()).catch(err => {
            this.stoppingError = err;
        }).then(() => {
            this.host.state = new Stopped(this.host, this.starting, this.running, this.stopping, 
            // this.startingError,
            // this.runningError,
            this.stoppingError);
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
    getRunning() {
        return this.running;
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
    constructor(host, starting, running, stopping, 
    // private startingError: Error | null,
    // private runningError: Error | null,
    stoppingError) {
        super();
        this.host = host;
        this.starting = starting;
        this.running = running;
        this.stopping = stopping;
        this.stoppingError = stoppingError;
    }
    postActivate() {
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
        return this.starting;
    }
    getStopping() {
        return this.stopping;
    }
    getRunning() {
        return this.running;
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
//# sourceMappingURL=states.js.map