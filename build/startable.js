"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = exports.Friendly = exports.Startable = void 0;
const manual_promise_1 = require("@zimtsui/manual-promise");
class Startable extends manual_promise_1.ManualPromise {
    constructor() {
        super();
        this.catch(() => { });
    }
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
}
exports.Startable = Startable;
class Friendly extends Startable {
}
exports.Friendly = Friendly;
class State {
}
exports.State = State;
//# sourceMappingURL=startable.js.map