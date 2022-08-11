"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncorrectState = exports.State = exports.Friendly = exports.Startable = void 0;
const autobind_decorator_1 = require("autobind-decorator");
const catch_throw_1 = require("./catch-throw");
class Startable {
    getReadyState() {
        return this.state.getReadyState();
    }
    /**
     * @throws IncorrectState
     */
    assertReadyState(action, states = ["STARTED" /* STARTED */]) {
        for (const state of states)
            if (this.getReadyState() === state)
                return;
        throw new IncorrectState(action, this.getReadyState());
    }
    /**
     * Skip from READY to STARTED.
     * @decorator `@boundMethod`
     */
    skart(onStopping) {
        this.state.skart(onStopping);
    }
    /**
     * - If it's READY now, then
     * 1. Start.
     * 1. Wait until STARTED.
     * - If it's STARTING or STARTED now, then
     * 1. Wait until STARTED.
     * @decorator `@boundMethod`
     * @decorator `@catchThrow()`
     */
    async start(onStopping) {
        return await this.state.start(onStopping);
    }
    /**
     * 1. Assert it's STARTING or STARTED now.
     * 1. Wait until STARTED.
     * @decorator `@boundMethod`
     * @decorator `@catchThrow()`
     */
    async assart(onStopping) {
        return await this.state.assart(onStopping);
    }
    /**
     * - If it's STARTED now, then
     * 1. Stop.
     * 1. Wait until STOPPED.
     * - If it's STOPPING or STOPPED now, then
     * 1. Wait until STOPPED.
     * @decorator `@boundMethod`
     * @decorator `@catchThrow()`
     */
    async stop(err) {
        return await this.state.stop(err);
    }
    /**
     * - If it's READY now, then
     * 1. Skip to STOPPED.
     * - If it's STARTING or STARTED now, then
     * 1. Wait until STARTED.
     * 1. Stop.
     * 1. Wait until STOPPED.
     * - If it's STOPPING or STOPPED now, then
     * 1. Wait until STOPPED.
     * @decorator `@boundMethod`
     * @decorator `@catchThrow()`
     */
    async starp(err) {
        return await this.state.starp(err);
    }
    getRunningPromise() {
        return this.state.getRunningPromise();
    }
}
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "skart", null);
__decorate([
    autobind_decorator_1.boundMethod,
    (0, catch_throw_1.catchThrow)()
], Startable.prototype, "start", null);
__decorate([
    autobind_decorator_1.boundMethod,
    (0, catch_throw_1.catchThrow)()
], Startable.prototype, "assart", null);
__decorate([
    autobind_decorator_1.boundMethod,
    (0, catch_throw_1.catchThrow)()
], Startable.prototype, "stop", null);
__decorate([
    autobind_decorator_1.boundMethod,
    (0, catch_throw_1.catchThrow)()
], Startable.prototype, "starp", null);
exports.Startable = Startable;
class Friendly extends Startable {
}
exports.Friendly = Friendly;
class State {
}
exports.State = State;
class IncorrectState extends Error {
    constructor(action, state) {
        super(`Cannot ${action} during ${state}.`);
    }
}
exports.IncorrectState = IncorrectState;
//# sourceMappingURL=startable.js.map