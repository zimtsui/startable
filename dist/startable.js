var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { EventEmitter } from 'events';
import { boundMethod } from 'autobind-decorator';
process.on('unhandledRejection', () => { });
class Startable extends EventEmitter {
    constructor() {
        super(...arguments);
        this.lifePeriod = "STOPPED" /* STOPPED */;
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
            this.onStopping = onStopping;
            return this._starting = this._start()
                .finally(() => {
                this.lifePeriod = "STARTED" /* STARTED */;
            });
        }
        return this.starting;
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
            if (this.onStopping)
                this.onStopping(err);
            return this._stopping = this._stop(err)
                .finally(() => {
                this.lifePeriod = "STOPPED" /* STOPPED */;
            });
        }
        return this.stopping;
    }
}
__decorate([
    boundMethod
], Startable.prototype, "start", null);
__decorate([
    boundMethod
], Startable.prototype, "stop", null);
export { Startable as default, Startable, };
//# sourceMappingURL=startable.js.map