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
    start(onStopping) {
        const p = this.state.start(onStopping);
        p.catch(() => { });
        return p;
    }
    assart(onStopping) {
        const p = this.state.assart(onStopping);
        p.catch(() => { });
        return p;
    }
    stop(err) {
        const p = this.state.stop(err);
        p.catch(() => { });
        return p;
    }
    starp(err) {
        const p = this.state.starp(err);
        p.catch(() => { });
        return p;
    }
    getStarting() {
        const p = this.state.getStarting();
        p.catch(() => { });
        return p;
    }
    getStopping() {
        const p = this.state.getStopping();
        p.catch(() => { });
        return p;
    }
    getPromise() {
        const p = this.state.getPromise();
        p.catch(() => { });
        return p;
    }
}
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
    getPromise() {
        return this.promise;
    }
}
exports.State = State;
//# sourceMappingURL=startable.js.map