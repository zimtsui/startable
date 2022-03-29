"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotTryStartDuringStopping = exports.CannotFailDuringStarted = exports.StopCalledDuringStarting = exports.CannotTryStopDuringStarting = exports.CannotFailDuringStopped = exports.CannotSkipStart = exports.CannotFail = exports.Startable = void 0;
var startable_1 = require("./startable");
Object.defineProperty(exports, "Startable", { enumerable: true, get: function () { return startable_1.Startable; } });
var startable_like_1 = require("./startable-like");
Object.defineProperty(exports, "CannotFail", { enumerable: true, get: function () { return startable_like_1.CannotFail; } });
Object.defineProperty(exports, "CannotSkipStart", { enumerable: true, get: function () { return startable_like_1.CannotSkipStart; } });
var stopped_1 = require("./states/stopped/stopped");
Object.defineProperty(exports, "CannotFailDuringStopped", { enumerable: true, get: function () { return stopped_1.CannotFailDuringStopped; } });
var starting_1 = require("./states/starting/starting");
Object.defineProperty(exports, "CannotTryStopDuringStarting", { enumerable: true, get: function () { return starting_1.CannotTryStopDuringStarting; } });
Object.defineProperty(exports, "StopCalledDuringStarting", { enumerable: true, get: function () { return starting_1.StopCalledDuringStarting; } });
var started_1 = require("./states/started/started");
Object.defineProperty(exports, "CannotFailDuringStarted", { enumerable: true, get: function () { return started_1.CannotFailDuringStarted; } });
var stopping_1 = require("./states/stopping/stopping");
Object.defineProperty(exports, "CannotTryStartDuringStopping", { enumerable: true, get: function () { return stopping_1.CannotTryStartDuringStopping; } });
//# sourceMappingURL=index.js.map