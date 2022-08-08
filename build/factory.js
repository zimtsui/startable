"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStartable = void 0;
const startable_1 = require("./startable");
const states_1 = require("./states");
class ReadyStartable extends startable_1.Startable {
    constructor(rawStart, rawStop) {
        super();
        this.rawStart = rawStart;
        this.rawStop = rawStop;
        this.state = new states_1.Ready(this);
        this.state.postActivate();
    }
}
function createStartable(rawStart, rawStop) {
    return new ReadyStartable(rawStart, rawStop);
}
exports.createStartable = createStartable;
//# sourceMappingURL=factory.js.map