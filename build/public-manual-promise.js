"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicManualPromise = void 0;
const manual_promise_1 = require("@zimtsui/manual-promise");
// export interface PublicManualPromiseLike extends Promise<void> {
// 	resolve(): void;
// 	reject(err: Error): void;
// }
class PublicManualPromise extends manual_promise_1.ManualPromise {
}
exports.PublicManualPromise = PublicManualPromise;
//# sourceMappingURL=public-manual-promise.js.map