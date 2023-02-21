"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stopped = exports.Stopping = exports.Started = exports.Starting = exports.Ready = exports.Friendly = exports.Startable = exports.State = void 0;
const autobind_decorator_1 = require("autobind-decorator");
const catch_throw_1 = require("./catch-throw");
const interfaces_1 = require("./interfaces");
const Interfaces = require("./interfaces");
const assert = require("assert");
const manual_promise_1 = require("@zimtsui/manual-promise");
class State {
}
exports.State = State;
var Startable;
(function (Startable) {
    function create(rawStart, rawStop) {
        return new Friendly(rawStart, rawStop);
    }
    Startable.create = create;
    Startable.ReadyState = Interfaces.ReadyState;
    Startable.StateError = Interfaces.StateError;
})(Startable = exports.Startable || (exports.Startable = {}));
class Friendly {
    constructor(rawStart, rawStop) {
        this.rawStart = rawStart;
        this.rawStop = rawStop;
        this.state = new Ready(this, {});
        this.state.activate();
    }
    getState() {
        return this.state.getState();
    }
    assertState(expected) {
        this.state.assertState(expected);
    }
    skart(startingError) {
        this.state.skart(startingError);
    }
    start(onStopping) {
        return this.state.start(onStopping);
    }
    async stop(err) {
        return await this.state.stop(err);
    }
    getRunning() {
        return this.state.getRunning();
    }
}
__decorate([
    autobind_decorator_1.boundMethod
], Friendly.prototype, "start", null);
__decorate([
    autobind_decorator_1.boundMethod,
    (0, catch_throw_1.catchThrow)()
], Friendly.prototype, "stop", null);
exports.Friendly = Friendly;
class Ready extends State {
    constructor(host, options) {
        super();
        this.host = host;
    }
    activate() { }
    assertState(expected) {
        assert(expected.includes(interfaces_1.ReadyState.READY), new interfaces_1.StateError(interfaces_1.ReadyState.READY, expected));
    }
    async start(onStopping) {
        this.host.state = new Starting(this.host, {
            onStopping: onStopping || null,
        });
        this.host.state.activate();
        await this.host.start();
    }
    async stop(err) {
        assert(!(err instanceof Error), new interfaces_1.StateError(interfaces_1.ReadyState.READY));
        this.host.state = new Stopped(this.host, {
            startingPromise: null,
            runningPromise: null,
            stoppingPromise: new manual_promise_1.ManualPromise(),
            stoppingError: null,
        });
        this.host.state.activate();
    }
    getState() {
        return interfaces_1.ReadyState.READY;
    }
    skart(err) {
        const startingError = err || null;
        this.host.state = new Started(this.host, {
            startingPromise: new manual_promise_1.ManualPromise(),
            onStoppings: [],
            startingError,
        });
        this.host.state.activate();
    }
    getRunning() {
        throw new interfaces_1.StateError(interfaces_1.ReadyState.READY);
    }
}
__decorate([
    (0, catch_throw_1.catchThrow)()
], Ready.prototype, "start", null);
exports.Ready = Ready;
class Starting extends State {
    constructor(host, options) {
        super();
        this.host = host;
        this.startingPromise = new manual_promise_1.ManualPromise();
        this.onStoppings = [];
        this.startingErrors = [];
        if (options.onStopping)
            this.onStoppings.push(options.onStopping);
    }
    assertState(expected) {
        assert(expected.includes(interfaces_1.ReadyState.STARTING), new interfaces_1.StateError(interfaces_1.ReadyState.STARTING, expected));
    }
    activate() {
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
            this.host.state.activate();
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
            throw new interfaces_1.StateError(interfaces_1.ReadyState.STARTING);
        }
        else {
            await this.startingPromise.catch(() => { });
            await this.host.stop();
        }
    }
    getState() {
        return interfaces_1.ReadyState.STARTING;
    }
    skart(err) {
        throw new interfaces_1.StateError(interfaces_1.ReadyState.STARTING);
    }
    getRunning() {
        throw new interfaces_1.StateError(interfaces_1.ReadyState.STARTING);
    }
}
__decorate([
    (0, catch_throw_1.catchThrow)()
], Starting.prototype, "start", null);
exports.Starting = Starting;
class Started extends State {
    constructor(host, args) {
        super();
        this.host = host;
        this.startingPromise = args.startingPromise;
        this.onStoppings = args.onStoppings;
        this.startingError = args.startingError;
    }
    assertState(expected) {
        assert(expected.includes(interfaces_1.ReadyState.STARTED), new interfaces_1.StateError(interfaces_1.ReadyState.STARTED, expected));
    }
    activate() {
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
        this.host.state.activate();
        await this.host.stop();
    }
    getState() {
        return interfaces_1.ReadyState.STARTED;
    }
    skart(err) {
        throw new interfaces_1.StateError(interfaces_1.ReadyState.STARTED);
    }
    getRunning() {
        return this.running;
    }
}
__decorate([
    (0, catch_throw_1.catchThrow)()
], Started.prototype, "start", null);
exports.Started = Started;
class Stopping extends State {
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
    assertState(expected) {
        assert(expected.includes(interfaces_1.ReadyState.STOPPING), new interfaces_1.StateError(interfaces_1.ReadyState.STOPPING, expected));
    }
    activate() {
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
            this.host.state.activate();
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
    getState() {
        return interfaces_1.ReadyState.STOPPING;
    }
    skart(err) {
        throw new interfaces_1.StateError(interfaces_1.ReadyState.STOPPING);
    }
    getRunning() {
        return this.runningPromise;
    }
}
__decorate([
    (0, catch_throw_1.catchThrow)()
], Stopping.prototype, "start", null);
exports.Stopping = Stopping;
class Stopped extends State {
    constructor(host, args) {
        super();
        this.host = host;
        this.startingPromise = args.startingPromise;
        this.runningPromise = args.runningPromise;
        this.stoppingPromise = args.stoppingPromise;
        this.stoppingError = args.stoppingError;
    }
    assertState(expected) {
        assert(expected.includes(interfaces_1.ReadyState.STOPPED), new interfaces_1.StateError(interfaces_1.ReadyState.STOPPED, expected));
    }
    activate() {
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
    getState() {
        return interfaces_1.ReadyState.STOPPED;
    }
    skart(err) {
        throw new interfaces_1.StateError(interfaces_1.ReadyState.STOPPED);
    }
    getRunning() {
        assert(this.runningPromise !== null, new ReferenceError());
        return this.runningPromise;
    }
}
exports.Stopped = Stopped;
//# sourceMappingURL=startable.js.map