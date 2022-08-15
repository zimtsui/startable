"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stopped = exports.Stopping = exports.Started = exports.Starting = exports.Ready = void 0;
const startable_1 = require("./startable");
const manual_promise_1 = require("@zimtsui/manual-promise");
const assert = require("assert");
const catch_throw_1 = require("./catch-throw");
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
    async stop(err) {
        assert(!(err instanceof Error), new startable_1.StateError('stop with an exception', startable_1.ReadyState.READY));
        this.host.state = new Stopped(this.host, {
            startingPromise: null,
            runningPromise: null,
            stoppingPromise: new manual_promise_1.ManualPromise(),
            stoppingError: null,
        });
        this.host.state.postActivate();
    }
    getReadyState() {
        return startable_1.ReadyState.READY;
    }
    skart(err) {
        const startingError = err || null;
        this.host.state = new Started(this.host, {
            startingPromise: new manual_promise_1.ManualPromise(),
            onStoppings: [],
            startingError,
        });
        this.host.state.postActivate();
    }
    getRunningPromise() {
        throw new startable_1.StateError('getRunningPromise', startable_1.ReadyState.READY);
    }
}
__decorate([
    (0, catch_throw_1.catchThrow)()
], Ready.prototype, "start", null);
exports.Ready = Ready;
class Starting extends startable_1.State {
    constructor(host, args) {
        super();
        this.host = host;
        this.startingPromise = new manual_promise_1.ManualPromise();
        this.onStoppings = [];
        this.startingErrors = [];
        if (args.onStopping)
            this.onStoppings.push(args.onStopping);
    }
    postActivate() {
        this.host.rawStart().catch(err => {
            this.startingErrors.push(err);
        }).then(() => {
            this.host.state = new Started(this.host, {
                startingPromise: this.startingPromise,
                onStoppings: this.onStoppings,
                startingError: this.startingErrors.length === 0
                    ? null
                    : this.startingErrors.length === 1
                        ? this.startingErrors[0]
                        : new AggregateError(this.startingErrors),
            });
            this.host.state.postActivate();
        });
    }
    async start(onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.startingPromise;
    }
    async stop(err) {
        if (err) {
            this.startingErrors.push(err);
            throw new startable_1.StateError('stop', startable_1.ReadyState.STARTING);
        }
        else {
            await this.startingPromise.catch(() => { });
            await this.host.stop();
        }
    }
    getReadyState() {
        return startable_1.ReadyState.STARTING;
    }
    skart(err) {
        throw new startable_1.StateError('skart', startable_1.ReadyState.STARTING);
    }
    getRunningPromise() {
        throw new startable_1.StateError('getRunningPromise', startable_1.ReadyState.STARTING);
    }
}
__decorate([
    (0, catch_throw_1.catchThrow)()
], Starting.prototype, "start", null);
exports.Starting = Starting;
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
    getReadyState() {
        return startable_1.ReadyState.STARTED;
    }
    skart(err) {
        throw new startable_1.StateError('skart', startable_1.ReadyState.STARTED);
    }
    getRunningPromise() {
        return this.running;
    }
}
__decorate([
    (0, catch_throw_1.catchThrow)()
], Started.prototype, "start", null);
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
        if (onStopping)
            onStopping();
        return this.startingPromise;
    }
    async stop(err) {
        await this.stoppingPromise;
    }
    getReadyState() {
        return startable_1.ReadyState.STOPPING;
    }
    skart(err) {
        throw new startable_1.StateError('skart', startable_1.ReadyState.STOPPING);
    }
    getRunningPromise() {
        return this.runningPromise;
    }
}
__decorate([
    (0, catch_throw_1.catchThrow)()
], Stopping.prototype, "start", null);
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
    start(onStopping) {
        assert(this.startingPromise !== null, new ReferenceError());
        if (onStopping)
            onStopping();
        return this.startingPromise;
    }
    async stop() {
        await this.stoppingPromise;
    }
    getReadyState() {
        return startable_1.ReadyState.STOPPED;
    }
    skart(err) {
        throw new startable_1.StateError('skart', startable_1.ReadyState.STOPPED);
    }
    getRunningPromise() {
        assert(this.runningPromise !== null, new ReferenceError());
        return this.runningPromise;
    }
}
exports.Stopped = Stopped;
//# sourceMappingURL=states.js.map