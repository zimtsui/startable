"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateError = exports.State = exports.Friendly = exports.Startable = exports.ReadyState = void 0;
const autobind_decorator_1 = require("autobind-decorator");
const catch_throw_1 = require("./catch-throw");
const assert_1 = require("assert");
var ReadyState;
(function (ReadyState) {
    ReadyState["READY"] = "READY";
    ReadyState["STARTING"] = "STARTING";
    ReadyState["STARTED"] = "STARTED";
    ReadyState["STOPPING"] = "STOPPING";
    ReadyState["STOPPED"] = "STOPPED";
})(ReadyState = exports.ReadyState || (exports.ReadyState = {}));
class Startable {
    getReadyState() {
        return this.state.getReadyState();
    }
    /**
     * @throws StateError
     */
    assertReadyState(action, expected = [ReadyState.STARTED]) {
        for (const state of expected)
            if (this.getReadyState() === state)
                return;
        throw new StateError(action, this.getReadyState(), expected);
    }
    /**
     * Skip from READY to STARTED.
     */
    skart(startingError) {
        this.state.skart(startingError);
    }
    /**
     * 1. If it's READY now, then
     * 	1. Start.
     * 1. Return the promise of STARTING.
     * @decorator `@boundMethod`
     * @throws ReferenceError
     */
    start(onStopping) {
        return this.state.start(onStopping);
    }
    /**
     * - If it's READY now, then
     * 	1. Skip to STOPPED.
     * - If it's STARTING now and `err` is given, then
     * 	1. Make the STARTING process throw `err`.
     * - Otherwise,
     * 	1. If it's STARTING now and `err` is not given, then
     * 		1. Wait until STARTED.
     * 	1. If it's STARTED now, then
     * 		1. Stop.
     * 	1. If it's STOPPING or STOPPED now, then
     * 		1. Return the promise of STOPPING.
     * @decorator `@boundMethod`
     * @decorator `@catchThrow()`
     */
    async stop(err) {
        return await this.state.stop(err);
    }
    /**
     * @throws ReferenceError
     */
    getRunningPromise() {
        return this.state.getRunningPromise();
    }
}
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "start", null);
__decorate([
    autobind_decorator_1.boundMethod,
    (0, catch_throw_1.catchThrow)()
], Startable.prototype, "stop", null);
exports.Startable = Startable;
class Friendly extends Startable {
}
exports.Friendly = Friendly;
class State {
}
exports.State = State;
class StateError extends assert_1.AssertionError {
    constructor(action, actualState, expectedStates) {
        super({
            expected: expectedStates,
            actual: actualState,
            operator: 'in',
        });
        this.action = action;
    }
}
exports.StateError = StateError;
//# sourceMappingURL=startable.js.map