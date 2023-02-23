"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = exports.Startable = void 0;
const autobind_decorator_1 = require("autobind-decorator");
const catch_throw_1 = require("./catch-throw");
const startable_like_1 = require("./startable-like");
const states_1 = require("./states");
class Startable {
    constructor(rawStart, rawStop) {
        this.state = new states_1.Ready(new Agent(this, {
            getState: () => this.state,
            setState: (newState) => { this.state = newState; },
            rawStart,
            rawStop,
        }), {});
        this.state.activate();
    }
    getReadyState() {
        return this.state.getReadyState();
    }
    /**
     *  @throws {@link StateError}
     *  @defaultValue `[ReadyState.STARTED]`
     */
    assertState(expected = [startable_like_1.ReadyState.STARTED]) {
        this.state.assertState(expected);
    }
    /**
     *  Skip from `READY` to `STARTED`.
     */
    skart(startingError) {
        this.state.skart(startingError);
    }
    /**
     *  - If it's `READY` when invoked, then
     *  	1. Start.
     *  	1. Return the promise of the `STARTING` process.
     *  - Otherwise,
     *  	1. Return the promise of the `STARTING` process.
     *  @throws ReferenceError
     *  @decorator `@catchThrow()`
     */
    async start(onStopping) {
        await this.state.start(onStopping);
    }
    /**
     *  - If it's `READY` when invoked, then
     *  	1. Skip to `STOPPED`.
     *  - If it's `STARTING` when invoked, then
     *  	1. Wait until `STARTED`.
     *  	1. Stop.
     *  	1. Return the promise of `STOPPING` process.
     *  - If it's `STARTED` when invoked, then
     *  	1. Stop.
     *  	1. Return the promise of `STOPPING` process.
     *  - If it's `STOPPING` or `STOPPED` when invoked, then
     *  	1. Return the promise of `STOPPING` process.
     *
     *  @decorator `@boundMethod`
     *  @decorator `@catchThrow()`
     */
    stop(err) {
        return this.state.stop(err);
    }
    /**
     *  @throws ReferenceError
     */
    getRunning() {
        return this.state.getRunning();
    }
}
__decorate([
    (0, catch_throw_1.catchThrow)()
], Startable.prototype, "start", null);
__decorate([
    (0, catch_throw_1.catchThrow)(),
    autobind_decorator_1.boundMethod
], Startable.prototype, "stop", null);
exports.Startable = Startable;
class Agent {
    constructor(target, options) {
        this.target = target;
        ({
            getState: this.getState,
            setState: this.setState,
            rawStart: this.rawStart,
            rawStop: this.rawStop,
        } = options);
    }
    getReadyState() {
        return this.target.getReadyState();
    }
    assertState(expected) {
        this.target.assertState(expected);
    }
    skart(startingError) {
        this.target.skart(startingError);
    }
    async start(onStopping) {
        await this.target.start(onStopping);
    }
    async stop(err) {
        await this.target.stop(err);
    }
    getRunning() {
        return this.target.getRunning();
    }
}
exports.Agent = Agent;
//# sourceMappingURL=startable.js.map