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
const injektor_1 = require("@zimtsui/injektor");
const types_1 = require("./injection/types");
const autobind_decorator_1 = require("autobind-decorator");
const Stopped = require("./states/stopped/factory");
const Starting = require("./states/starting/factory");
const Started = require("./states/started/factory");
const Stopping = require("./states/stopping/factory");
const factories_1 = require("./factories");
class Startable {
    constructor(rawStart, rawStop) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        class Container extends injektor_1.BaseContainer {
            constructor() {
                super(...arguments);
                this[_a] = this.rcs(Stopped.Factory);
                this[_b] = this.rcs(Starting.Factory);
                this[_c] = this.rcs(Started.Factory);
                this[_d] = this.rcs(Stopping.Factory);
                this[_e] = this.rcs(friendly_startable_1.FriendlyStartable);
                this[_f] = this.rcs(factories_1.Factories);
                this[_g] = this.rv(rawStart);
                this[_h] = this.rv(rawStop);
            }
        }
        _a = types_1.TYPES.StoppedFactory, _b = types_1.TYPES.StartingFactory, _c = types_1.TYPES.StartedFactory, _d = types_1.TYPES.StoppingFactory, _e = types_1.TYPES.FriendlyStartable, _f = types_1.TYPES.Factories, _g = types_1.TYPES.RawStart, _h = types_1.TYPES.RawStop;
        const c = new Container();
        this.friendly = c[types_1.TYPES.FriendlyStartable]();
        const initialState = c[types_1.TYPES.StoppedFactory]().create({
            stoppingPromise: Promise.resolve(),
        });
        this.friendly.setState(initialState);
        initialState.postActivate();
    }
    getReadyState() {
        return this.friendly.getReadyState();
    }
    skipStart(onStopping) {
        this.friendly.skipStart(onStopping);
    }
    async start(onStopping) {
        await this.friendly.start(onStopping);
    }
    async assart(onStopping) {
        await this.friendly.assart(onStopping);
    }
    async stop(err) {
        await this.friendly.stop(err);
    }
    starp(err) {
        const promise = this.friendly.starp(err);
        promise.catch(() => { });
        return promise;
    }
}
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "starp", null);
exports.Startable = Startable;
//# sourceMappingURL=startable.js.map