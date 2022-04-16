"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotAssartDuringStopping = exports.CannotSkipStartDuringStopping = void 0;
class CannotSkipStartDuringStopping extends Error {
    constructor() {
        super('Cannot call .skipStart() during STOPPING.');
    }
}
exports.CannotSkipStartDuringStopping = CannotSkipStartDuringStopping;
class CannotAssartDuringStopping extends Error {
    constructor() {
        super('Cannot call .assart() during STOPPING.');
    }
}
exports.CannotAssartDuringStopping = CannotAssartDuringStopping;
//# sourceMappingURL=stopping-like.js.map