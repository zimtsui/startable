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
        this.container.rfs(friendly_startable_like_1.FriendlyStartableLike, () => this);
        this.container.rcs(stopped_1.Stopped.Factory, stopped_1.Stopped.Factory);
        this.container.rcs(starting_1.Starting.Factory, starting_1.Starting.Factory);
        this.container.rcs(started_1.Started.Factory, started_1.Started.Factory);
        this.container.rcs(stopping_1.Stopping.Factory, stopping_1.Stopping.Factory);
        this.factories = {
            stopped: this.container.initiate(stopped_1.Stopped.Factory),
            starting: this.container.initiate(starting_1.Starting.Factory),
            started: this.container.initiate(started_1.Started.Factory),
            stopping: this.container.initiate(stopping_1.Stopping.Factory),
        };
        this.state = this.factories.stopped.create({
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
    async assart(onStopping) {
        await this.state.assart(onStopping);
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