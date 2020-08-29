import chai from 'chai';
const { assert } = chai;
class PrimitiveStartable {
    constructor() {
        this.lifePeriod = 0 /* CONSTRUCTED */;
    }
    async start(stopping) {
        assert(this.lifePeriod === 0 /* CONSTRUCTED */
            || this.lifePeriod === 5 /* STOPPED */);
        this.lifePeriod = 1 /* STARTING */;
        this.onStopping = stopping;
        return this.started = this._start()
            .then(() => {
            this.lifePeriod = 2 /* STARTED */;
        }, (err) => {
            this.lifePeriod = 3 /* FAILED */;
            throw err;
        });
    }
    async stop(err) {
        assert(this.lifePeriod !== 0 /* CONSTRUCTED */);
        if (this.lifePeriod === 4 /* STOPPING */ ||
            this.lifePeriod === 5 /* STOPPED */ ||
            this.lifePeriod === 6 /* BROKEN */)
            return Promise.resolve()
                // in case _stop() calls stop() syncly
                .then(() => this.stopped);
        if (this.lifePeriod === 1 /* STARTING */)
            return Promise.resolve()
                // in case _start() calls stop() syncly
                .then(() => this.started)
                .catch(() => { })
                .then(() => this.stop(err));
        this.lifePeriod = 4 /* STOPPING */;
        this.stopped = this._stop(err)
            .then(() => {
            this.lifePeriod = 5 /* STOPPED */;
        }, (err) => {
            this.lifePeriod = 6 /* BROKEN */;
            throw err;
        });
        if (this.onStopping)
            this.onStopping(err);
        return this.stopped;
    }
}
export { PrimitiveStartable as default, PrimitiveStartable, };
//# sourceMappingURL=primitive.js.map