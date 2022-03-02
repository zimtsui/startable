"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendlyStartable = void 0;
const stopped_1 = require("./states/stopped");
const starting_1 = require("./states/starting");
const started_1 = require("./states/started");
const stopping_1 = require("./states/stopping");
class FriendlyStartable {
    constructor(rawStart, rawStop) {
        this.rawStart = rawStart;
        this.rawStop = rawStop;
        this.factories = {
            stopped: new stopped_1.Stopped.Factory(this),
            starting: new starting_1.Starting.Factory(this),
            started: new started_1.Started.Factory(this),
            stopping: new stopping_1.Stopping.Factory(this),
        };
        this.state = this.factories.stopped.create({
            stoppingPromise: Promise.resolve(),
        });
    }
    getReadyState() {
        return this.state.getReadyState();
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
exports.FriendlyStartable = FriendlyStartable;
//# sourceMappingURL=friendly-startable.js.map