"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotSkipStartDuringStopping = exports.CannotSkipStartDuringStarted = exports.CannotSkipStartDuringStarting = exports.StarpCalledDuringStarting = exports.CannotStarpDuringStopped = exports.Startable = void 0;
const constructor_1 = require("./constructor");
var Startable;
(function (Startable) {
    Startable.create = constructor_1.create;
})(Startable = exports.Startable || (exports.Startable = {}));
var state_1 = require("./states/stopped/state");
Object.defineProperty(exports, "CannotStarpDuringStopped", { enumerable: true, get: function () { return state_1.CannotStarpDuringStopped; } });
var state_2 = require("./states/starting/state");
Object.defineProperty(exports, "StarpCalledDuringStarting", { enumerable: true, get: function () { return state_2.StarpCalledDuringStarting; } });
Object.defineProperty(exports, "CannotSkipStartDuringStarting", { enumerable: true, get: function () { return state_2.CannotSkipStartDuringStarting; } });
var state_3 = require("./states/started/state");
Object.defineProperty(exports, "CannotSkipStartDuringStarted", { enumerable: true, get: function () { return state_3.CannotSkipStartDuringStarted; } });
var state_4 = require("./states/stopping/state");
Object.defineProperty(exports, "CannotSkipStartDuringStopping", { enumerable: true, get: function () { return state_4.CannotSkipStartDuringStopping; } });
//# sourceMappingURL=index.js.map