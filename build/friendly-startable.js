"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendlyStartable = void 0;
const injektor_1 = require("injektor");
const friendly_startable_like_1 = require("./friendly-startable-like");
const stopped_1 = require("./states/stopped/stopped");
const starting_1 = require("./states/starting/starting");
const started_1 = require("./states/started/started");
const stopping_1 = require("./states/stopping/stopping");
class FriendlyStartable {
    constructor(rawStart, rawStop) {
        this.rawStart = rawStart;
        this.rawStop = rawStop;
        this.container = new injektor_1.Container();
        const factories = {
            stopped: new stopped_1.Stopped.Factory(),
            starting: new starting_1.Starting.Factory(),
            started: new started_1.Started.Factory(),
            stopping: new stopping_1.Stopping.Factory(),
        };
        this.container.register(stopped_1.Stopped.FactoryDeps, () => factories);
        this.container.register(starting_1.Starting.FactoryDeps, () => factories);
        this.container.register(started_1.Started.FactoryDeps, () => factories);
        this.container.register(stopping_1.Stopping.FactoryDeps, () => factories);
        this.container.register(friendly_startable_like_1.FriendlyStartableLike, () => this);
        this.container.inject(factories.stopped);
        this.container.inject(factories.starting);
        this.container.inject(factories.started);
        this.container.inject(factories.stopping);
        this.state = factories.stopped.create({
            stoppingPromise: Promise.resolve(),
        });
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
    async starp(err) {
        await this.state.starp(err);
    }
    async stop(err) {
        await this.state.stop(err);
    }
}
exports.FriendlyStartable = FriendlyStartable;
//# sourceMappingURL=friendly-startable.js.map