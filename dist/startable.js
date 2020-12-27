import { EventEmitter } from 'events';
class Startable extends EventEmitter {
    constructor() {
        super(...arguments);
        this.lifePeriod = "STOPPED" /* STOPPED */;
        this.onStoppings = [];
        this._starting = Promise.resolve();
        this._stopping = Promise.resolve();
    }
    get starting() {
        // in case _start() calls start() syncly
        return Promise.resolve().then(() => this._starting);
    }
    async start(onStopping) {
        if (this.lifePeriod === "STOPPING" /* STOPPING */)
            await this.stopping.catch(() => { });
        if (this.lifePeriod === "STOPPED" /* STOPPED */) {
            this.lifePeriod = "STARTING" /* STARTING */;
            this.onStoppings = onStopping ? [onStopping] : [];
            return this._starting = this._start()
                .finally(() => {
                this.lifePeriod = "STARTED" /* STARTED */;
            });
        }
        else {
            if (onStopping)
                this.onStoppings.push(onStopping);
            return this.starting;
        }
    }
    get stopping() {
        // in case _stop() or onStopping() calls stop() syncly
        return Promise.resolve().then(() => this._stopping);
    }
    async stop(err) {
        if (this.lifePeriod === "STARTING" /* STARTING */)
            await this.starting.catch(() => { });
        if (this.lifePeriod === "STARTED" /* STARTED */) {
            this.lifePeriod = "STOPPING" /* STOPPING */;
            for (const onStopping of this.onStoppings)
                onStopping();
            return this._stopping = this._stop(err)
                .finally(() => {
                this.lifePeriod = "STOPPED" /* STOPPED */;
            });
        }
        return this.stopping;
    }
}
export { Startable as default, Startable, };
//# sourceMappingURL=startable.js.map