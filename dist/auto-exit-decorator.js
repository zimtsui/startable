"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const timers_1 = require("timers");
const process_1 = __importDefault(require("process"));
const console_error_sync_1 = require("./console-error-sync");
/*
    用于 pandora service 自析构
    1. stop 总不结束怎么办
    2. stop 结束但 pandora 不知道怎么办。一个 pandora process 中
        还有其他 service 比如内置的 logger serive 都可能 ref 了一堆东西，
        就算这个 service 完全 unref 干净了，进程也不会自动退出。
    3. stop 抛出异常怎么办
*/
const autoExitDecorator = (stopTimeout) => function (Original) {
    class AutoExit extends Original {
        stop() {
            const _super = Object.create(null, {
                stop: { get: () => super.stop }
            });
            return __awaiter(this, void 0, void 0, function* () {
                timers_1.setTimeout(() => {
                    console_error_sync_1.consoleErrorSync('stop times out');
                    process_1.default.exit(1);
                }, stopTimeout).unref(); // 解决 1
                yield _super.stop.call(this).catch((err) => {
                    // 解决 3
                    console_error_sync_1.consoleErrorSync(err);
                    process_1.default.exit(1);
                });
                process_1.default.exit(); // 解决 2
            });
        }
    }
    return AutoExit;
};
exports.default = autoExitDecorator;
//# sourceMappingURL=auto-exit-decorator.js.map