"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatefulStartable = void 0;
const startable_1 = require("./startable");
const chai_1 = require("chai");
class StatefulStartable extends startable_1.Startable {
    constructor() {
        super(...arguments);
        this.StatefulStartable$restored = false;
    }
    async Startable$start() {
        /*
            the type is boolean or undefined,
            so "=== false" is preferred than "!"
        */
        if (this.StatefulStartable$restored === false) {
            this.StatefulStartable$restored = undefined;
            await this.StatefulStartable$rawStart();
        }
        else
            this.StatefulStartable$restored = undefined;
    }
    async Startable$stop() {
        await this.StatefulStartable$rawStop();
        this.StatefulStartable$restored = false;
    }
    capture() {
        return this.StatefulStartable$rawCapture();
    }
    restore(backup) {
        (0, chai_1.assert)(this.readyState === "STOPPED" /* STOPPED */);
        this.StatefulStartable$restored = true;
        this.StatefulStartable$rawRestore(backup);
    }
}
exports.StatefulStartable = StatefulStartable;
//# sourceMappingURL=stateful-startable.js.map