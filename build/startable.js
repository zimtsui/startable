"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = exports.Friendly = exports.Startable = void 0;
class Startable {
    getPromise() {
        const p = this.state.getPromise();
        p.catch(() => { });
        return p;
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
    getPromise() {
        return this.promise;
    }
}
exports.State = State;
//# sourceMappingURL=startable.js.map