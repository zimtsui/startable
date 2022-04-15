"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Startable = void 0;
const friendly_startable_1 = require("./friendly-startable");
const autobind_decorator_1 = require("autobind-decorator");
class Startable extends friendly_startable_1.FriendlyStartable {
    static create(rawStart, rawStop) {
        return new Startable(rawStart, rawStop);
    }
    constructor(rawStart, rawStop) {
        super(rawStart, rawStop);
    }
    stop(err) {
        const promise = super.stop(err);
        promise.catch(() => { });
        return promise;
    }
}
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "stop", null);
exports.Startable = Startable;
//# sourceMappingURL=startable.js.map