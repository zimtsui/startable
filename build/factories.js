"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factories = void 0;
const Stopped = require("./states/stopped/factory");
const Starting = require("./states/starting/factory");
const Started = require("./states/started/factory");
const Stopping = require("./states/stopping/factory");
class Factories {
    constructor() {
        this.stopped = new Stopped.Factory(this);
        this.starting = new Starting.Factory(this);
        this.started = new Started.Factory(this);
        this.stopping = new Stopping.Factory(this);
    }
}
exports.Factories = Factories;
//# sourceMappingURL=factories.js.map