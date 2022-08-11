"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stopped = exports.Stopping = exports.Started = exports.StarpCalledDuringStarting = exports.Starting = exports.SkipFromReadytoStarted = exports.SkipFromReadyToStopped = exports.Ready = void 0;
const startable_1 = require("./startable");
const manual_promise_1 = require("@zimtsui/manual-promise");
class Ready extends startable_1.State {
    constructor(host, args) {
        super();
        this.host = host;
    }
    postActivate() { }
    async start(onStopping) {
        this.host.state = new Starting(this.host, {
            onStopping: onStopping || null,
        });
        this.host.state.postActivate();
        await this.host.start();
    }
    async assart(onStopping) {
        throw new startable_1.IncorrectState('assart', "READY" /* READY */);
    }
    async stop() {
        throw new startable_1.IncorrectState('stop', "READY" /* READY */);
    }
    async starp(err) {
        const stoppingError = new SkipFromReadyToStopped();
        const startingPromise = Promise.reject(stoppingError);
        startingPromise.catch(() => { });
        const runningPromise = Promise.reject(stoppingError);
        runningPromise.catch(() => { });
        this.host.state = new Stopped(this.host, {
            startingPromise,
            runningPromise,
            stoppingPromise: new manual_promise_1.ManualPromise(),
            stoppingError,
        });
        this.host.state.postActivate();
    }
    getReadyState() {
        return "READY" /* READY */;
    }
    skart(onStopping) {
        const startingError = new SkipFromReadytoStarted();
        this.host.state = new Started(this.host, {
            startingPromise: new manual_promise_1.ManualPromise(),
            onStoppings: onStopping ? [onStopping] : [],
            startingError,
        });
        this.host.state.postActivate();
    }
    getRunningPromise() {
        throw new startable_1.IncorrectState('getRunningPromise', "READY" /* READY */);
    }
}
exports.Ready = Ready;
class SkipFromReadyToStopped extends Error {
}
exports.SkipFromReadyToStopped = SkipFromReadyToStopped;
class SkipFromReadytoStarted extends Error {
}
exports.SkipFromReadytoStarted = SkipFromReadytoStarted;
class Starting extends startable_1.State {
    constructor(host, args) {
        super();
        this.host = host;
        this.startingPromise = new manual_promise_1.ManualPromise();
        this.onStoppings = [];
        this.startingError = null;
        if (args.onStopping)
            this.onStoppings.push(args.onStopping);
    }
    postActivate() {
        this.host.rawStart().catch(err => {
            this.startingError = err;
        }).then(() => {
            this.host.state = new Started(this.host, {
                startingPromise: this.startingPromise,
                onStoppings: this.onStoppings,
                startingError: this.startingError,
            });
            this.host.state.postActivate();
        });
    }
    async start(onStopping) {
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
        throw new startable_1.IncorrectState('stop', "STARTING" /* STARTING */);
    }
    async starp(err) {
        this.startingError = new StarpCalledDuringStarting();
        await this.startingPromise.catch(() => { });
        await this.host.stop(err);
    }
    getReadyState() {
        return "STARTING" /* STARTING */;
    }
    skart(onStopping) {
        throw new startable_1.IncorrectState('skart', "STARTING" /* STARTING */);
    }
    getRunningPromise() {
        throw new startable_1.IncorrectState('getRunningPromise', "STARTING" /* STARTING */);
    }
}
exports.Starting = Starting;
class StarpCalledDuringStarting extends Error {
}
exports.StarpCalledDuringStarting = StarpCalledDuringStarting;
class Started extends startable_1.State {
    constructor(host, args) {
        super();
        this.host = host;
        this.startingPromise = args.startingPromise;
        this.onStoppings = args.onStoppings;
        this.startingError = args.startingError;
    }
    postActivate() {
        if (this.startingError)
            this.startingPromise.reject(this.startingError);
        else
            this.startingPromise.resolve();
        const running = new Promise((resolve, reject) => {
            this.start(err => {
                if (err)
                    reject(err);
                else
                    resolve();
            }).catch(() => { });
        });
        running.catch(() => { });
        this.running = running;
    }
    async start(onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.startingPromise;
    }
    async assart(onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.startingPromise;
    }
    async stop(runningError) {
        this.host.state = new Stopping(this.host, {
            startingPromise: this.startingPromise,
            runningPromise: this.running,
            onStoppings: this.onStoppings,
            runningError: runningError || null,
        });
        this.host.state.postActivate();
        await this.host.stop();
    }
    async starp(err) {
        await this.stop(err);
    }
    getReadyState() {
        return "STARTED" /* STARTED */;
    }
    skart(onStopping) {
        throw new startable_1.IncorrectState('skart', "STARTED" /* STARTED */);
    }
    getRunningPromise() {
        return this.running;
    }
}
exports.Started = Started;
class Stopping extends startable_1.State {
    constructor(host, args) {
        super();
        this.host = host;
        this.stoppingPromise = new manual_promise_1.ManualPromise();
        this.stoppingError = null;
        this.startingPromise = args.startingPromise;
        this.runningPromise = args.runningPromise;
        this.onStoppings = args.onStoppings;
        this.runningError = args.runningError;
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
            this.host.state = new Stopped(this.host, {
                startingPromise: this.startingPromise,
                runningPromise: this.runningPromise,
                stoppingPromise: this.stoppingPromise,
                stoppingError: this.stoppingError,
            });
            this.host.state.postActivate();
        });
    }
    async start(onStopping) {
        return this.startingPromise;
    }
    async assart(onStopping) {
        throw new startable_1.IncorrectState('assart', "STOPPING" /* STOPPING */);
    }
    async stop(err) {
        await this.stoppingPromise;
    }
    async starp(err) {
        await this.stop(err);
    }
    getReadyState() {
        return "STOPPING" /* STOPPING */;
    }
    skart(onStopping) {
        throw new startable_1.IncorrectState('skart', "STOPPING" /* STOPPING */);
    }
    getRunningPromise() {
        return this.runningPromise;
    }
}
exports.Stopping = Stopping;
class Stopped extends startable_1.State {
    constructor(host, args) {
        super();
        this.host = host;
        this.startingPromise = args.startingPromise;
        this.runningPromise = args.runningPromise;
        this.stoppingPromise = args.stoppingPromise;
        this.stoppingError = args.stoppingError;
    }
    postActivate() {
        if (this.stoppingError)
            this.stoppingPromise.reject(this.stoppingError);
        else
            this.stoppingPromise.resolve();
    }
    async start(onStopping) {
        return this.startingPromise;
    }
    async assart(onStopping) {
        throw new startable_1.IncorrectState('assart', "STOPPED" /* STOPPED */);
    }
    async stop() {
        await this.stoppingPromise;
    }
    async starp(err) {
        throw new startable_1.IncorrectState('starp', "STOPPED" /* STOPPED */);
    }
    getReadyState() {
        return "STOPPED" /* STOPPED */;
    }
    skart(onStopping) {
        throw new startable_1.IncorrectState('skart', "STOPPED" /* STOPPED */);
    }
    getRunningPromise() {
        return this.runningPromise;
    }
}
exports.Stopped = Stopped;
//# sourceMappingURL=states.js.map