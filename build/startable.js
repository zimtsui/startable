"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Startable = void 0;
const events_1 = require("events");
const chai_1 = require("chai");
class Startable extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.readyState = "STOPPED" /* STOPPED */;
        this.onStoppings = [];
        this.errStopDuringStarting = null;
        this._starting = Promise.resolve();
        this._stopping = Promise.resolve();
        this.stop = (err) => {
            if (this.readyState === "STARTING" /* STARTING */) {
                chai_1.assert(err);
                this.errStopDuringStarting = err;
                const stopping = this.start()
                    .catch(() => { })
                    .then(() => {
                    throw new Error('start() failed.');
                });
                ;
                stopping.catch(() => { });
                return stopping;
            }
            if (this.readyState === "STARTED" /* STARTED */) {
                this.readyState = "STOPPING" /* STOPPING */;
                for (const onStopping of this.onStoppings)
                    onStopping(err);
                this._stopping = this._stop(err)
                    .finally(() => {
                    this.readyState = "STOPPED" /* STOPPED */;
                });
                this._stopping.catch(() => { });
            }
            // in case _stop() or onStopping() calls stop() syncly
            const stopping = Promise.resolve().then(() => this._stopping);
            stopping.catch(() => { });
            return stopping;
        };
    }
    hasNotBeenStopping(onStopping) {
        chai_1.assert(this.readyState === "STARTING" /* STARTING */ ||
            this.readyState === "STARTED" /* STARTED */);
        return this.start(onStopping);
    }
    async start(onStopping) {
        if (this.readyState === "STOPPED" /* STOPPED */) {
            this.readyState = "STARTING" /* STARTING */;
            this.errStopDuringStarting = null;
            this.onStoppings = [];
            this._starting = this._start()
                .finally(() => {
                this.readyState = "STARTED" /* STARTED */;
            }).then(result => {
                if (this.errStopDuringStarting)
                    throw this.errStopDuringStarting;
                return result;
            });
            this._starting.catch(() => { });
        }
        if (onStopping)
            this.onStoppings.push(onStopping);
        // in case _start() calls start() syncly
        return Promise.resolve().then(() => this._starting);
    }
}
exports.Startable = Startable;
//# sourceMappingURL=startable.js.map