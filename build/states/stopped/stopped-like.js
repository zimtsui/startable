"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotAssartDuringStopped = exports.CannotStarpDuringStopped = void 0;
class CannotStarpDuringStopped extends Error {
    constructor() {
        super('Cannot call .starp() during STOPPED.');
    }
}
exports.CannotStarpDuringStopped = CannotStarpDuringStopped;
class CannotAssartDuringStopped extends Error {
    constructor() {
        super('Cannot call .assart() during STOPPED.');
    }
}
exports.CannotAssartDuringStopped = CannotAssartDuringStopped;
//# sourceMappingURL=stopped-like.js.map