import chai from 'chai';
const { assert } = chai;
class PrimitiveStartable {
    constructor() {
        this.lifePeriod = "CONSTRUCTED" /* CONSTRUCTED */;
    }
    async start(stopping) {
        assert(this.lifePeriod === "CONSTRUCTED" /* CONSTRUCTED */
            || this.lifePeriod === "STOPPED" /* STOPPED */);
        this.lifePeriod = "STARTING" /* STARTING */;
        this.onStopping = stopping;
        return this.started = this._start()
            .then(() => {
            this.lifePeriod = "STARTED" /* STARTED */;
        }, (err) => {
            this.lifePeriod = "FAILED" /* FAILED */;
            throw err;
        });
    }
    async stop(err) {
        if (this.lifePeriod === "CONSTRUCTED" /* CONSTRUCTED */) {
            this.lifePeriod = "STOPPED" /* STOPPED */;
            this.stopped = Promise.resolve();
            return;
        }
        if (this.lifePeriod === "STOPPING" /* STOPPING */ ||
            this.lifePeriod === "STOPPED" /* STOPPED */ ||
            this.lifePeriod === "BROKEN" /* BROKEN */)
            return Promise.resolve()
                // in case _stop() calls stop() syncly
                .then(() => this.stopped);
        if (this.lifePeriod === "STARTING" /* STARTING */)
            return Promise.resolve()
                // in case _start() calls stop() syncly
                .then(() => this.started)
                .catch(() => { })
                .then(() => this.stop(err));
        this.lifePeriod = "STOPPING" /* STOPPING */;
        this.stopped = this._stop(err)
            .then(() => {
            this.lifePeriod = "STOPPED" /* STOPPED */;
        }, (err) => {
            this.lifePeriod = "BROKEN" /* BROKEN */;
            throw err;
        });
        if (this.onStopping)
            this.onStopping(err);
        return this.stopped;
    }
}
export { PrimitiveStartable as default, PrimitiveStartable, };
//# sourceMappingURL=primitive.js.map