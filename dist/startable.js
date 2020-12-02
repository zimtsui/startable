import { EventEmitter } from 'events';
class Illegal extends Error {
}
class Startable extends EventEmitter {
    constructor() {
        super(...arguments);
        this.lifePeriod = "STOPPED" /* STOPPED */;
        this.started = Promise.resolve();
        this.stopped = Promise.resolve();
    }
    async start(onStopping) {
        if (this.lifePeriod === "STOPPED" /* STOPPED */ ||
            this.lifePeriod === "NSTOPPED" /* NSTOPPED */) {
            this.lifePeriod = "STARTING" /* STARTING */;
            this.onStopping = onStopping;
            return this.started = this._start()
                .then(() => {
                this.lifePeriod = "STARTED" /* STARTED */;
            }, (err) => {
                this.lifePeriod = "NSTARTED" /* NSTARTED */;
                throw err;
            });
        }
        if (this.lifePeriod === "STARTING" /* STARTING */ ||
            this.lifePeriod === "STARTED" /* STARTED */ ||
            this.lifePeriod === "NSTARTED" /* NSTARTED */)
            // in case _start() calls start() syncly
            return Promise.resolve().then(() => this.started);
        throw new Illegal(this.lifePeriod);
    }
    async stop(err) {
        if (this.lifePeriod === "STARTING" /* STARTING */)
            throw new Illegal(this.lifePeriod);
        if (this.lifePeriod === "STARTED" /* STARTED */ ||
            this.lifePeriod === "NSTARTED" /* NSTARTED */) {
            this.lifePeriod = "STOPPING" /* STOPPING */;
            if (this.onStopping)
                this.onStopping(err);
            return this.stopped = this._stop(err)
                .then(() => {
                this.lifePeriod = "STOPPED" /* STOPPED */;
            }, (err) => {
                this.lifePeriod = "NSTOPPED" /* NSTOPPED */;
                throw err;
            });
        }
        // in case _stop() or onStopping() calls stop() syncly
        return Promise.resolve().then(() => this.stopped);
    }
}
export { Startable as default, Startable, Illegal, };
//# sourceMappingURL=startable.js.map