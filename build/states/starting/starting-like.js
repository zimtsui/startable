"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotSkipStartDuringStarting = void 0;
class CannotSkipStartDuringStarting extends Error {
    constructor() {
        super('Cannot call .skipStart() during STARTING.');
    }
}
exports.CannotSkipStartDuringStarting = CannotSkipStartDuringStarting;
//# sourceMappingURL=starting-like.js.map