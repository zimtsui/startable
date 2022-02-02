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
        if (this.StatefulStartable$restored)
            this.StatefulStartable$restored = false;
        else
            await this.StatefulStartable$start();
    }
    async Startable$stop() {
        await this.StatefulStartable$stop();
    }
    capture() {
        (0, chai_1.assert)(
        // TODO
        this.readyState === "STOPPED" /* STOPPED */ ||
            this.readyState === "STARTED" /* STARTED */);
        return this.StatefulStartable$capture();
    }
    restore(backup) {
        (0, chai_1.assert)(this.readyState === "STOPPED" /* STOPPED */);
        this.StatefulStartable$restored = true;
        this.StatefulStartable$restore(backup);
    }
}
exports.StatefulStartable = StatefulStartable;
//# sourceMappingURL=stateful-startable.js.map