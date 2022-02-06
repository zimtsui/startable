"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Startable = void 0;
const events_1 = require("events");
const autobind_decorator_1 = require("autobind-decorator");
const states_1 = require("./states");
class Startable extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.Startble$state = new states_1.State.Stopped(this, state => { this.Startble$state = state; }, {
            rawStart: this.Startable$rawStart,
            rawStop: this.Startable$rawStop,
            stoppingPromise: Promise.resolve(),
        }, {});
    }
    async start(onStopping) {
        await this.Startble$state.start(onStopping);
    }
    stop(err) {
        const promise = this.Startble$state.stop(err);
        promise.catch(() => { });
        return promise;
    }
    getReadyState() {
        return this.Startble$state.readyState;
    }
}
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "stop", null);
exports.Startable = Startable;
//# sourceMappingURL=startable.js.map