"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Startable = void 0;
const injektor_1 = require("injektor");
const friendly_startable_1 = require("./friendly-startable");
const autobind_decorator_1 = require("autobind-decorator");
const stopped_like_1 = require("./states/stopped/stopped-like");
const starting_like_1 = require("./states/starting/starting-like");
const started_like_1 = require("./states/started/started-like");
const stopping_like_1 = require("./states/stopping/stopping-like");
const stopped_1 = require("./states/stopped/stopped");
const starting_1 = require("./states/starting/starting");
const started_1 = require("./states/started/started");
const stopping_1 = require("./states/stopping/stopping");
class Startable {
    constructor(rawStart, rawStop) {
        this.container = new injektor_1.Container();
        const factories = {
            stopped: new stopped_1.Stopped.Factory(),
            starting: new starting_1.Starting.Factory(),
            started: new started_1.Started.Factory(),
            stopping: new stopping_1.Stopping.Factory(),
        };
        this.friendly = new friendly_startable_1.FriendlyStartable(rawStart, rawStop);
        this.container.register(stopped_like_1.StoppedLike.FactoryLike, () => factories.stopped);
        this.container.register(starting_like_1.StartingLike.FactoryLike, () => factories.starting);
        this.container.register(started_like_1.StartedLike.FactoryLike, () => factories.started);
        this.container.register(stopping_like_1.StoppingLike.FactoryLike, () => factories.stopping);
        this.container.register(friendly_startable_1.FriendlyStartable, () => this.friendly);
        this.container.inject(factories.stopped);
        this.container.inject(factories.starting);
        this.container.inject(factories.started);
        this.container.inject(factories.stopping);
        this.container.register(friendly_startable_1.initialState, () => factories.stopped.create({
            stoppingPromise: Promise.resolve(),
        }));
        this.container.inject(this.friendly);
    }
    getReadyState() {
        return this.friendly.getReadyState();
    }
    async tryStart(onStopping) {
        await this.friendly.tryStart(onStopping);
    }
    async start(onStopping) {
        await this.friendly.start(onStopping);
    }
    async tryStop(err) {
        await this.friendly.tryStop(err);
    }
    stop(err) {
        const promise = this.friendly.stop(err);
        promise.catch(() => { });
        return promise;
    }
    async fail(err) {
        this.friendly.fail(err);
    }
    skipStart(onStopping) {
        this.friendly.skipStart(onStopping);
    }
}
__decorate([
    autobind_decorator_1.boundMethod
], Startable.prototype, "stop", null);
exports.Startable = Startable;
//# sourceMappingURL=startable.js.map