"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Startable = exports.StopCalledDuringStarting = void 0;
const events_1 = require("events");
const chai_1 = require("chai");
class StopCalledDuringStarting extends Error {
    constructor() {
        super('.stop() is called during STARTING. The ongoing start() will fail.');
    }
}
exports.StopCalledDuringStarting = StopCalledDuringStarting;
class Startable extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.readyState = "STOPPED" /* STOPPED */;
        this.Startable$onStoppings = [];
        this.Startable$starting = Promise.resolve();
        this.Startable$stopping = Promise.resolve();
        /*
            stop() 不能是 async，否则 stop() 的返回值和 this.Startable$stopping 不是
            同一个 Promise 对象，stop() 的值如果外部没有 catch 就会抛到全局空间去。
        */
        this.stop = (err) => {
            if (this.readyState === "STARTING" /* STARTING */) {
                const abortionDuringStarting = new StopCalledDuringStarting();
                this.Startable$errorDuringStarting =
                    err ||
                        this.Startable$errorDuringStarting ||
                        abortionDuringStarting;
                return Promise.reject(abortionDuringStarting);
            }
            if (this.readyState === "STARTED" /* STARTED */ ||
                this.readyState === "UNSTARTED" /* UNSTARTED */) {
                this.readyState = "STOPPING" /* STOPPING */;
                for (const onStopping of this.Startable$onStoppings)
                    onStopping(err);
                // in case $Startable$stop() or onStopping() calls stop() syncly
                this.Startable$stopping = new Promise((resolve, reject) => {
                    this.Startable$resolve = resolve;
                    this.Startable$reject = reject;
                });
                this.Startable$stopping.catch(() => { });
                this.Startable$stop(err).then(() => {
                    this.Startable$resolve();
                    this.readyState = "STOPPED" /* STOPPED */;
                }).catch(err => {
                    this.Startable$reject(err);
                    this.readyState = "UNSTOPPED" /* UNSTOPPED */;
                });
            }
            return this.Startable$stopping;
        };
    }
    async assart(onStopping) {
        (0, chai_1.assert)(this.readyState === "STARTING" /* STARTING */ ||
            this.readyState === "STARTED" /* STARTED */, '.assert() is allowed during only STARTING or STARTED.');
        return this.start(onStopping);
    }
    start(onStopping) {
        if (this.readyState === "STOPPED" /* STOPPED */ ||
            this.readyState === "UNSTOPPED" /* UNSTOPPED */) {
            this.readyState = "STARTING" /* STARTING */;
            this.Startable$errorDuringStarting = null;
            this.Startable$onStoppings = [];
            // in case Startable$start() calls start() syncly
            this.Startable$starting = new Promise((resolve, reject) => {
                this.Startable$resolve = resolve;
                this.Startable$reject = reject;
            });
            // this.Startable$starting.catch(() => { });
            this.Startable$start().then(() => {
                if (this.Startable$errorDuringStarting)
                    throw this.Startable$errorDuringStarting;
            }).then(() => {
                this.Startable$resolve();
                this.readyState = "STARTED" /* STARTED */;
            }).catch(err => {
                this.Startable$reject(err);
                this.readyState = "UNSTARTED" /* UNSTARTED */;
            });
        }
        if (onStopping)
            this.Startable$onStoppings.push(onStopping);
        return this.Startable$starting;
    }
}
exports.Startable = Startable;
//# sourceMappingURL=startable.js.map