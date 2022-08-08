"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchThrow = void 0;
const assert = require("assert");
function catchThrow(newError) {
    return function decorator(proto, name, descriptor) {
        assert(descriptor.value instanceof Function);
        const oldMethod = descriptor.value;
        function newMethod(...args) {
            try {
                const p = oldMethod.apply(this, args);
                if (p instanceof Promise) {
                    const q = p.catch(oldError => {
                        throw newError || oldError;
                    });
                    q.catch(() => { });
                    return q;
                }
                return p;
            }
            catch (oldError) {
                throw newError || oldError;
            }
        }
        return {
            value: newMethod,
        };
    };
}
exports.catchThrow = catchThrow;
//# sourceMappingURL=catch-throw.js.map