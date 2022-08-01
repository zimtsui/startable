"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = exports.Friendly = exports.Startable = void 0;
class Startable {
    constructor() {
        this.getReadyState = () => {
            return this.state.getReadyState();
        };
        this.skipStart = (onStopping) => {
            this.state.skipStart(onStopping);
        };
        this.start = async (startArgs, onStopping) => {
            await this.state.start(startArgs, onStopping);
        };
        this.assart = async (onStopping) => {
            await this.state.assart(onStopping);
        };
        this.stop = (err) => {
            const promise = this.state.stop(err);
            promise.catch(() => { });
            return promise;
        };
        this.starp = (err) => {
            const promise = this.state.starp(err);
            promise.catch(() => { });
            return promise;
        };
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