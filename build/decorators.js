"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertStateSync = exports.AssertStateAsync = exports.AsRawStop = exports.AsRawStart = exports.$ = void 0;
const startable_1 = require("./startable");
const startable_like_1 = require("./startable-like");
const rawStartName = Symbol();
const rawStopName = Symbol();
const startableSym = Symbol();
function $(target) {
    if (!Reflect.has(target, startableSym)) {
        const rawStart = Reflect.has(target, rawStartName)
            ? Reflect.get(target, Reflect.get(target, rawStartName))
            : () => { };
        const rawStop = Reflect.has(target, rawStopName)
            ? Reflect.get(target, Reflect.get(target, rawStopName))
            : () => { };
        Reflect.set(target, startableSym, new startable_1.Startable(async (...args) => {
            return rawStart.apply(target, args);
        }, async (...args) => {
            return rawStop.apply(target, args);
        }));
    }
    return Reflect.get(target, startableSym);
}
exports.$ = $;
function AsRawStart() {
    return (proto, name, propDesc) => {
        Reflect.set(proto, rawStartName, name);
    };
}
exports.AsRawStart = AsRawStart;
function AsRawStop() {
    return (proto, name, propDesc) => {
        Reflect.set(proto, rawStopName, name);
    };
}
exports.AsRawStop = AsRawStop;
function AssertStateAsync(expected = [startable_like_1.ReadyState.STARTED]) {
    return (proto, name, propDesc) => {
        const method = Reflect.get(proto, name);
        return {
            value: async function (...args) {
                $(this).assertState(expected);
                return await method.apply(this, args);
            }
        };
    };
}
exports.AssertStateAsync = AssertStateAsync;
function AssertStateSync(expected = [startable_like_1.ReadyState.STARTED]) {
    return (proto, name, propDesc) => {
        const method = Reflect.get(proto, name);
        return {
            value: function (...args) {
                $(this).assertState(expected);
                return method.apply(this, args);
            }
        };
    };
}
exports.AssertStateSync = AssertStateSync;
//# sourceMappingURL=decorators.js.map