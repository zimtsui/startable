"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const timers_1 = __importDefault(require("timers"));
const process_1 = __importDefault(require("process"));
const autoExitDecorator = (delay) => function (Original) {
    class AutoExit extends Original {
        stop() {
            const _super = Object.create(null, {
                stop: { get: () => super.stop }
            });
            return __awaiter(this, void 0, void 0, function* () {
                timers_1.default.setTimeout(() => process_1.default.exit(-1), delay).unref();
                yield _super.stop.call(this);
            });
        }
    }
    return AutoExit;
};
exports.default = autoExitDecorator;
//# sourceMappingURL=auto-exit-decorator.js.map