"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStartable = void 0;
const concrete_startable_1 = require("./concrete-startable");
class StartableFactory {
    create(rawStart, rawStop) {
        return new concrete_startable_1.ConcreteStartable(rawStart, rawStop);
    }
}
function createStartable(rawStart, rawStop) {
    const startableFactory = new StartableFactory();
    return startableFactory.create(rawStart, rawStop);
}
exports.createStartable = createStartable;
//# sourceMappingURL=startable-factory.js.map