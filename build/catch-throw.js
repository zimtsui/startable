"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ = exports.catchThrow = void 0;
function catchThrow() {
    return function decorator(proto, name, descriptor) {
        const oldMethod = Reflect.get(proto, name);
        const newMethod = function (...args) {
            return $(oldMethod.apply(this, args));
        };
        return {
            value: newMethod,
        };
    };
}
exports.catchThrow = catchThrow;
function $(p) {
    Promise.resolve(p).catch(() => { });
    return p;
}
exports.$ = $;
//# sourceMappingURL=catch-throw.js.map