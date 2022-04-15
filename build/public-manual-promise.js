"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicManualPromise = void 0;
const manual_promise_1 = require("manual-promise");
class PublicManualPromise extends manual_promise_1.ManualPromise {
    constructor() {
        super();
    }
    static create() {
        return new PublicManualPromise();
    }
}
exports.PublicManualPromise = PublicManualPromise;
//# sourceMappingURL=public-manual-promise.js.map