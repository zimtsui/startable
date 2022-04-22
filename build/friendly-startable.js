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
        this.c = new injektor_1.Container();
        this.c.rv(friendly_startable_like_1.FriendlyStartableLike, this);
        this.c.rcs(stopped_1.Stopped.Factory, stopped_1.Stopped.Factory);
        this.c.rcs(starting_1.Starting.Factory, starting_1.Starting.Factory);
        this.c.rcs(started_1.Started.Factory, started_1.Started.Factory);
        this.c.rcs(stopping_1.Stopping.Factory, stopping_1.Stopping.Factory);
        this.factories = {
            stopped: this.c.i(stopped_1.Stopped.Factory),
            starting: this.c.i(starting_1.Starting.Factory),
            started: this.c.i(started_1.Started.Factory),
            stopping: this.c.i(stopping_1.Stopping.Factory),
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