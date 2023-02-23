"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsRawStop = exports.AsRawStart = exports.$ = void 0;
const startable_1 = require("./startable");
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
//# sourceMappingURL=decorators.js.map