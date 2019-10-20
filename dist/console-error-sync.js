"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("util");
function consoleErrorSync(data, ...args) {
    fs_1.writeSync(2, util_1.format(data, ...args) + '\n');
}
exports.consoleErrorSync = consoleErrorSync;
exports.default = consoleErrorSync;
//# sourceMappingURL=console-error-sync.js.map