"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = exports.Friendly = exports.Startable = void 0;
const autobind_decorator_1 = require("autobind-decorator");
class Startable {
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
    async stop(err) {
        await this.state.stop(err);
    }
    starp(err) {
        const promise = this.state.starp(err);
        promise.catch(() => { });
        return promise;
    }
}
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "getReadyState", null);
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "skipStart", null);
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "start", null);
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "assart", null);
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "stop", null);
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "starp", null);
exports.Startable = Startable;
class Friendly extends Startable {
}
exports.Friendly = Friendly;
class State {
}
exports.State = State;
//# sourceMappingURL=startable.js.map