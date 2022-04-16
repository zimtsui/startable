"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotStopDuringStopped = exports.StoppedLike = void 0;
var StoppedLike;
(function (StoppedLike) {
    StoppedLike.FactoryLike = {};
})(StoppedLike = exports.StoppedLike || (exports.StoppedLike = {}));
class CannotStopDuringStopped extends Error {
    constructor() {
        super('Cannot call .stop() during STOPPED.');
    }
}
exports.CannotStopDuringStopped = CannotStopDuringStopped;
//# sourceMappingURL=stopped-like.js.map