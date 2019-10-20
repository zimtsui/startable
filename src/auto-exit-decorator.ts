import { setTimeout } from 'timers';
import process from 'process';
import { consoleErrorSync } from './console-error-sync';

/*
    用于 pandora service 自析构
    1. stop 总不结束怎么办
    2. stop 结束但 pandora 不知道怎么办。一个 pandora process 中
        还有其他 service 比如内置的 logger serive 都可能 ref 了一堆东西，
        就算这个 service 完全 unref 干净了，进程也不会自动退出。
    3. stop 抛出异常怎么办
*/

const autoExitDecorator = (stopTimeout: number) =>
    function (Original: any): any {
        class AutoExit extends Original {
            public async stop() {
                setTimeout(
                    () => {
                        consoleErrorSync('stop times out');
                        process.exit(1);
                    },
                    stopTimeout,
                ).unref(); // 解决 1

                await super.stop().catch((err: Error) => {
                    // 解决 3
                    consoleErrorSync(err);
                    process.exit(1);
                });
                process.exit(); // 解决 2
            }
        }
        return AutoExit;
    }

export default autoExitDecorator;
