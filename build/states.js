"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stopped = exports.Stopping = exports.Started = exports.Starting = exports.Ready = void 0;
const startable_like_1 = require("./startable-like");
const assert = require("assert");
const manual_promise_1 = require("@zimtsui/manual-promise");
const state_1 = require("./state");
const catch_throw_1 = require("./catch-throw");
class Ready extends state_1.State {
    constructor(agent, options) {
        super();
        this.agent = agent;
    }
    activate() { }
    async start(onStopping) {
        const newState = new Starting(this.agent, {
            onStopping: onStopping || null,
        });
        this.agent.setState(newState);
        newState.activate();
        await this.agent.start();
    }
    async stop(err) {
        assert(!(err instanceof Error), new startable_like_1.StateError(startable_like_1.ReadyState.READY));
        const newState = new Stopped(this.agent, {
            starting: null,
            running: null,
            stopping: (0, catch_throw_1._)(new manual_promise_1.ManualPromise()),
            stoppingError: null,
        });
        this.agent.setState(newState);
        newState.activate();
    }
    getReadyState() {
        return startable_like_1.ReadyState.READY;
    }
    skart(err) {
        const startingError = err || null;
        const starting = new manual_promise_1.ManualPromise();
        const newState = new Started(this.agent, {
            starting,
            onStoppings: [],
            startingError,
        });
        this.agent.setState(newState);
        newState.activate();
    }
    getRunning() {
        throw new startable_like_1.StateError(startable_like_1.ReadyState.READY);
    }
}
exports.Ready = Ready;
class Starting extends state_1.State {
    constructor(agent, options) {
        super();
        this.agent = agent;
        this.starting = (0, catch_throw_1._)(new manual_promise_1.ManualPromise());
        this.onStoppings = [];
        this.startingError = null;
        if (options.onStopping)
            this.onStoppings.push(options.onStopping);
    }
    activate() {
        this.agent.rawStart().catch(err => {
            this.startingError = err;
        }).then(() => {
            const newState = new Started(this.agent, {
                starting: this.starting,
                onStoppings: this.onStoppings,
                startingError: this.startingError,
            });
            this.agent.setState(newState);
            newState.activate();
        });
    }
    async start(onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.starting;
    }
    async stop(err) {
        await this.start().catch(() => { });
        await this.agent.stop(err);
    }
    getReadyState() {
        return startable_like_1.ReadyState.STARTING;
    }
    skart(err) {
        throw new startable_like_1.StateError(startable_like_1.ReadyState.STARTING);
    }
    getRunning() {
        throw new startable_like_1.StateError(startable_like_1.ReadyState.STARTING);
    }
}
exports.Starting = Starting;
class Started extends state_1.State {
    constructor(agent, args) {
        super();
        this.agent = agent;
        this.starting = args.starting;
        this.onStoppings = args.onStoppings;
        this.startingError = args.startingError;
    }
    activate() {
        if (this.startingError)
            this.starting.reject(this.startingError);
        else
            this.starting.resolve();
        this.running = (0, catch_throw_1._)(new Promise((resolve, reject) => {
            (0, catch_throw_1._)(this.start(err => {
                if (err)
                    reject(err);
                else
                    resolve();
            }));
        }));
    }
    async start(onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.starting;
    }
    async stop(runningError) {
        const newState = new Stopping(this.agent, {
            starting: (0, catch_throw_1._)(Promise.resolve(this.starting)),
            running: this.running,
            onStoppings: this.onStoppings,
            runningError: runningError || null,
        });
        this.agent.setState(newState);
        newState.activate();
        await this.agent.stop();
    }
    getReadyState() {
        return startable_like_1.ReadyState.STARTED;
    }
    skart(err) {
        throw new startable_like_1.StateError(startable_like_1.ReadyState.STARTED);
    }
    getRunning() {
        return this.running;
    }
}
exports.Started = Started;
class Stopping extends state_1.State {
    constructor(agent, args) {
        super();
        this.agent = agent;
        this.stopping = (0, catch_throw_1._)(new manual_promise_1.ManualPromise());
        this.stoppingError = null;
        this.starting = args.starting;
        this.running = args.running;
        this.onStoppings = args.onStoppings;
        this.runningError = args.runningError;
    }
    activate() {
        if (this.runningError)
            for (const onStopping of this.onStoppings)
                onStopping(this.runningError);
        else
            for (const onStopping of this.onStoppings)
                onStopping();
        (this.runningError
            ? this.agent.rawStop(this.runningError)
            : this.agent.rawStop()).catch(err => {
            this.stoppingError = err;
        }).then(() => {
            const newState = new Stopped(this.agent, {
                starting: this.starting,
                running: this.running,
                stopping: this.stopping,
                stoppingError: this.stoppingError,
            });
            this.agent.setState(newState);
            newState.activate();
        });
    }
    async start(onStopping) {
        if (onStopping)
            onStopping();
        return this.starting;
    }
    async stop(err) {
        await this.stopping;
    }
    getReadyState() {
        return startable_like_1.ReadyState.STOPPING;
    }
    skart(err) {
        throw new startable_like_1.StateError(startable_like_1.ReadyState.STOPPING);
    }
    getRunning() {
        return this.running;
    }
}
exports.Stopping = Stopping;
class Stopped extends state_1.State {
    constructor(agent, args) {
        super();
        this.agent = agent;
        this.starting = args.starting;
        this.running = args.running;
        this.stopping = args.stopping;
        this.stoppingError = args.stoppingError;
    }
    activate() {
        if (this.stoppingError)
            this.stopping.reject(this.stoppingError);
        else
            this.stopping.resolve();
    }
    start(onStopping) {
        assert(this.starting !== null, new ReferenceError());
        if (onStopping)
            onStopping();
        return this.starting;
    }
    async stop() {
        await this.stopping;
    }
    getReadyState() {
        return startable_like_1.ReadyState.STOPPED;
    }
    skart(err) {
        throw new startable_like_1.StateError(startable_like_1.ReadyState.STOPPED);
    }
    getRunning() {
        assert(this.running !== null, new ReferenceError());
        return this.running;
    }
}
exports.Stopped = Stopped;
//# sourceMappingURL=states.js.map