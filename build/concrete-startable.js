"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteStartable = void 0;
const startable_1 = require("./startable");
const state_factories_1 = require("./state-factories");
class ConcreteStartable extends startable_1.Startable {
    constructor(rawStart, rawStop) {
        super();
        this.rawStart = rawStart;
        this.rawStop = rawStop;
        const stateFactories = new state_factories_1.StateFactories();
        const initialState = stateFactories.stopped.create(this, {
            stoppingPromise: Promise.resolve(),
        });
        this.state = initialState;
        initialState.postActivate();
    }
}
exports.ConcreteStartable = ConcreteStartable;
//# sourceMappingURL=concrete-startable.js.map