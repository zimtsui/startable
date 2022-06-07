"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendlyStartable = void 0;
const types_1 = require("./injection/types");
const injektor_1 = require("@zimtsui/injektor");
let FriendlyStartable = class FriendlyStartable {
    constructor(rawStart, rawStop) {
        this.rawStart = rawStart;
        this.rawStop = rawStop;
        // this.factories.stopped.create({
        // 	stoppingPromise: Promise.resolve(),
        // });
    }
    setState(state) {
        this.state = state;
    }
    getState() {
        return this.state;
    }
    getReadyState() {
        return this.state.getReadyState();
    }
    skipStart(onStopping) {
        this.state.skipStart(onStopping);
    }
    async start(onStopping) {
        await this.state.start(onStopping);
    }
    async assart(onStopping) {
        await this.state.assart(onStopping);
    }
    async starp(err) {
        await this.state.starp(err);
    }
    async stop(err) {
        await this.state.stop(err);
    }
};
FriendlyStartable = __decorate([
    __param(0, (0, injektor_1.inject)(types_1.TYPES.RawStart)),
    __param(1, (0, injektor_1.inject)(types_1.TYPES.RawStop))
], FriendlyStartable);
exports.FriendlyStartable = FriendlyStartable;
//# sourceMappingURL=friendly-startable.js.map