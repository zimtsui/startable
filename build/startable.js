"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Startable = exports.StopDuringStarting = void 0;
const events_1 = require("events");
const chai_1 = require("chai");
class StopDuringStarting extends Error {
}
exports.StopDuringStarting = StopDuringStarting;
class Startable extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.readyState = "STOPPED" /* STOPPED */;
        this._onStoppings = [];
        this._starting = Promise.resolve();
        this._stopping = Promise.resolve();
        /*
            stop() 不能是 async，否则 stop() 的返回值和 this._stopping 不是
            同一个 Promise 对象，stop() 的值如果外部没有 catch 就会抛到全局空间去。
        */
        this.stop = (err) => {
            if (this.readyState === "STARTING" /* STARTING */) {
                this._stopErrorDuringStarting = err ||
                    this._stopErrorDuringStarting ||
                    new Error('.start() stopped by stop() with no reason.');
                return Promise.reject(new StopDuringStarting('.stop() called during starting.'));
                // const stopping = this.start()
                //     .finally(() => Promise.reject(
                //         new StopDuringStarting('Stop during starting.'),
                //     ));
                // stopping.catch(() => { });
                // return stopping;
            }
            if (this.readyState === "STARTED" /* STARTED */ ||
                this.readyState === "UNSTARTED" /* UNSTARTED */) {
                this.readyState = "STOPPING" /* STOPPING */;
                for (const onStopping of this._onStoppings)
                    onStopping(err);
                // in case _stop() or onStopping() calls stop() syncly
                this._stopping = new Promise((resolve, reject) => {
                    this._resolve = resolve;
                    this._reject = reject;
                });
                this._stopping.catch(() => { });
                this._stop(err).then(() => {
                    this._resolve();
                    this.readyState = "STOPPED" /* STOPPED */;
                }).catch(err => {
                    this._reject(err);
                    this.readyState = "UNSTOPPED" /* UNSTOPPED */;
                });
            }
            return this._stopping;
        };
    }
    async assart(onStopping) {
        chai_1.assert(this.readyState === "STARTING" /* STARTING */ ||
            this.readyState === "STARTED" /* STARTED */, 'Not STARTING or STARTED.');
        return this.start(onStopping);
    }
    start(onStopping) {
        if (this.readyState === "STOPPED" /* STOPPED */ ||
            this.readyState === "UNSTOPPED" /* UNSTOPPED */) {
            this.readyState = "STARTING" /* STARTING */;
            this._stopErrorDuringStarting = null;
            this._onStoppings = [];
            // in case _start() calls start() syncly
            this._starting = new Promise((resolve, reject) => {
                this._resolve = resolve;
                this._reject = reject;
            });
            // this._starting.catch(() => { });
            this._start().then(() => {
                if (this._stopErrorDuringStarting)
                    throw this._stopErrorDuringStarting;
            }).then(() => {
                this._resolve();
                this.readyState = "STARTED" /* STARTED */;
            }).catch(err => {
                this._reject(err);
                this.readyState = "UNSTARTED" /* UNSTARTED */;
            });
        }
        if (onStopping)
            this._onStoppings.push(onStopping);
        return this._starting;
    }
}
exports.Startable = Startable;
//# sourceMappingURL=startable.js.map