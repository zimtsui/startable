"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ = exports.catchThrow = void 0;
function catchThrow() {
    return function decorator(proto, name, descriptor) {
        const oldMethod = Reflect.get(proto, name);
        const newMethod = function (...args) {
            return _(oldMethod.apply(this, args));
        };
        return {
            value: newMethod,
        };
    };
}
exports.catchThrow = catchThrow;
function _(p) {
    Promise.resolve(p).catch(() => { });
    return p;
}
exports._ = _;
//# sourceMappingURL=catch-throw.js.map