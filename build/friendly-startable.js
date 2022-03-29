"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendlyStartable = exports.initialState = void 0;
const injektor_1 = require("injektor");
exports.initialState = {};
class FriendlyStartable {
    constructor(rawStart, rawStop) {
        this.rawStart = rawStart;
        this.rawStop = rawStop;
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
    async tryStart(onStopping) {
        await this.state.tryStart(onStopping);
    }
    async start(onStopping) {
        await this.state.start(onStopping);
    }
    async tryStop(err) {
        await this.state.tryStop(err);
    }
    async stop(err) {
        await this.state.stop(err);
    }
    async fail(err) {
        await this.state.fail(err);
    }
}
__decorate([
    (0, injektor_1.inject)(exports.initialState)
], FriendlyStartable.prototype, "state", void 0);
exports.FriendlyStartable = FriendlyStartable;
//# sourceMappingURL=friendly-startable.js.map