"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Startable = void 0;
const events_1 = require("events");
class Startable extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.lifePeriod = "STOPPED" /* STOPPED */;
        this.onStoppings = [];
        this.starp = (err) => void this
            .start()
            .finally(() => this.stop(err))
            .catch(() => { });
        this._starting = Promise.resolve();
        this._stopping = Promise.resolve();
    }
    async start(onStopping) {
        if (this.lifePeriod === "STOPPED" /* STOPPED */) {
            this.lifePeriod = "STARTING" /* STARTING */;
            this.onStoppings = [];
            this._starting = this._start()
                .finally(() => {
                this.lifePeriod = "STARTED" /* STARTED */;
            });
        }
        if (onStopping)
            this.onStoppings.push(onStopping);
        // in case _start() calls start() syncly
        return Promise.resolve().then(() => this._starting);
    }
    async stop(err) {
        if (this.lifePeriod === "STARTED" /* STARTED */) {
            this.lifePeriod = "STOPPING" /* STOPPING */;
            for (const onStopping of this.onStoppings)
                onStopping(err);
            this._stopping = this._stop(err)
                .finally(() => {
                this.lifePeriod = "STOPPED" /* STOPPED */;
            });
        }
        // in case _stop() or onStopping() calls stop() syncly
        return Promise.resolve().then(() => this._stopping);
    }
}
exports.Startable = Startable;
//# sourceMappingURL=startable.js.map