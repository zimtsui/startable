"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotSkipStart = exports.CannotFail = exports.State = void 0;
class State {
    constructor(startable) {
        this.startable = startable;
    }
}
exports.State = State;
class CannotFail extends Error {
}
exports.CannotFail = CannotFail;
class CannotSkipStart extends Error {
}
exports.CannotSkipStart = CannotSkipStart;
//# sourceMappingURL=state.js.map