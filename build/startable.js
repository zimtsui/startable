"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = exports.Friendly = exports.Startable = void 0;
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
        return this.state.getStarting();
    }
    getStopping() {
        return this.state.getStopping();
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