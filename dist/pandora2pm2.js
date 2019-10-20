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
const autonomous_1 = require("./autonomous");
const timers_1 = require("timers");
const process_1 = __importDefault(require("process"));
const console_error_sync_1 = require("./console-error-sync");
const DEV = !process_1.default.send;
const DEFAULT_EXIT_TIMEOUT = 1000;
const DEFAULT_STOP_TIMEOUT = 5000;
const label = '[pandora2pm2]';
/*
    几个问题
    1. stop 总不结束怎么办
    2. stop 结束之后进程总不结束怎么办。说明有东西没 unref 干净
*/
function pandora2Pm2(Services) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const services = Services.map(Services => new Services());
            let stopping;
            function stop() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (stopping)
                        return stopping;
                    if (DEV)
                        console.log(`${label} stopping`);
                    stopping = services
                        .reverse()
                        .reduce((stopped, service) => stopped
                        .then(() => service.stop()), Promise.resolve());
                    const timer = timers_1.setTimeout(() => {
                        console_error_sync_1.consoleErrorSync(`${label} stop times out`);
                        process_1.default.exit(1);
                    }, process_1.default.env.STOP_TIMEOUT
                        ? Number.parseInt(process_1.default.env.STOP_TIMEOUT)
                        : DEFAULT_STOP_TIMEOUT);
                    yield stopping.catch(err => {
                        console_error_sync_1.consoleErrorSync(err);
                        process_1.default.exit(1);
                    });
                    timers_1.clearTimeout(timer);
                    if (DEV)
                        console.log(`${label} stopped`);
                    timers_1.setTimeout(() => {
                        console_error_sync_1.consoleErrorSync(`${label} exit times out`);
                        process_1.default.exit(0);
                    }, process_1.default.env.EXIT_TIMEOUT
                        ? Number.parseInt(process_1.default.env.EXIT_TIMEOUT)
                        : DEFAULT_EXIT_TIMEOUT).unref();
                });
            }
            process_1.default.once('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
                process_1.default.once('SIGINT', () => {
                    console_error_sync_1.consoleErrorSync(`${label} forced to exit`);
                    process_1.default.exit(1);
                });
                yield stop();
            }));
            if (DEV)
                console.log(`${label} starting`);
            for (const service of services)
                if (service instanceof autonomous_1.Autonomous)
                    yield service.start(stop);
                else
                    yield service.start();
            if (DEV)
                console.log(`${label} started`);
            else
                process_1.default.send('ready');
        }
        catch (err) {
            console_error_sync_1.consoleErrorSync(err);
            process_1.default.exit(1);
        }
    });
}
exports.pandora2Pm2 = pandora2Pm2;
exports.default = pandora2Pm2;
//# sourceMappingURL=pandora2pm2.js.map