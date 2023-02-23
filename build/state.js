"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
const assert = require("assert");
const startable_like_1 = require("./startable-like");
class State {
    assertState(expected) {
        assert(expected.includes(this.getReadyState()), new startable_like_1.StateError(this.getReadyState(), expected));
    }
}
exports.State = State;
//# sourceMappingURL=state.js.map