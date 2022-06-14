"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const startable_1 = require("./startable");
const factories_1 = require("./factories");
class constructor extends startable_1.Startable {
    constructor(rawStart, rawStop) {
        super();
        this.rawStart = rawStart;
        this.rawStop = rawStop;
        const factories = new factories_1.Factories();
        const initialState = factories.stopped.create(this, {
            stoppingPromise: Promise.resolve(),
        });
        this.state = initialState;
        initialState.postActivate();
    }
}
// 不能单独导出一个类的多态构造函数，所以只能工厂函数
function create(rawStart, rawStop) {
    return new constructor(rawStart, rawStop);
}
exports.create = create;
//# sourceMappingURL=constructor.js.map