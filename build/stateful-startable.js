"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatefulStartable = void 0;
const startable_1 = require("./startable");
const assert = require("assert");
class StatefulStartable extends startable_1.Startable {
    constructor(rawStart, rawStop, rawCapture, rawRestore) {
        super(rawStart, rawStop);
        this.rawStart = rawStart;
        this.rawStop = rawStop;
        this.rawCapture = rawCapture;
        this.rawRestore = rawRestore;
    }
    capture() {
        assert(this.getReadyState() !== "STARTING" /* STARTING */);
        return this.rawCapture();
    }
    restore(backup) {
        assert(this.getReadyState() === "STOPPED" /* STOPPED */);
        this.rawRestore(backup);
    }
}
exports.StatefulStartable = StatefulStartable;
//# sourceMappingURL=stateful-startable.js.map