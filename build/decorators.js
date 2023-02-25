"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetStateSync = exports.AssetStateAsync = exports.AsRawStop = exports.AsRawStart = exports.$ = void 0;
const startable_1 = require("./startable");
const startable_like_1 = require("./startable-like");
const rawStartSym = Symbol();
const rawStopSym = Symbol();
const startableSym = Symbol();
function $(target) {
    if (!Reflect.has(target, rawStartSym))
        Reflect.set(target, rawStartSym, () => { });
    if (!Reflect.has(target, rawStopSym))
        Reflect.set(target, rawStopSym, () => { });
    if (!Reflect.has(target, startableSym))
        Reflect.set(target, startableSym, new startable_1.Startable(() => Promise.resolve(Reflect.get(target, rawStartSym)()), () => Promise.resolve(Reflect.get(target, rawStopSym)())));
    return Reflect.get(target, startableSym);
}
exports.$ = $;
function AsRawStart() {
    return (proto, name, propDesc) => {
        const rawStart = Reflect.get(proto, name);
        Reflect.set(proto, rawStartSym, rawStart);
    };
}
exports.AsRawStart = AsRawStart;
function AsRawStop() {
    return (proto, name, propDesc) => {
        const rawStop = Reflect.get(proto, name);
        Reflect.set(proto, rawStopSym, rawStop);
    };
}
exports.AsRawStop = AsRawStop;
function AssetStateAsync(expected = [startable_like_1.ReadyState.STARTED]) {
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
exports.AssetStateAsync = AssetStateAsync;
function AssetStateSync(expected = [startable_like_1.ReadyState.STARTED]) {
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
exports.AssetStateSync = AssetStateSync;
//# sourceMappingURL=decorators.js.map