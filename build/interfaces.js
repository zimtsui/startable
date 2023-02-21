"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateError = exports.ReadyState = void 0;
const assert_1 = require("assert");
var ReadyState;
(function (ReadyState) {
    ReadyState["READY"] = "READY";
    ReadyState["STARTING"] = "STARTING";
    ReadyState["STARTED"] = "STARTED";
    ReadyState["STOPPING"] = "STOPPING";
    ReadyState["STOPPED"] = "STOPPED";
})(ReadyState = exports.ReadyState || (exports.ReadyState = {}));
class StateError extends assert_1.AssertionError {
    constructor(actual, expected) {
        super({
            expected,
            actual,
            operator: 'in',
        });
    }
}
exports.StateError = StateError;
//# sourceMappingURL=interfaces.js.map