"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotSkipStartDuringStarted = void 0;
class CannotSkipStartDuringStarted extends Error {
    constructor() {
        super('Cannot call .skipStart() during STARTED.');
    }
}
exports.CannotSkipStartDuringStarted = CannotSkipStartDuringStarted;
//# sourceMappingURL=started-like.js.map