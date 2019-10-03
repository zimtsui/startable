import Timer from 'timers';
import process from 'process';

const autoExitDecorator = (delay: number) =>
    function (Original: any): any {
        class AutoExit extends Original {
            public async stop() {
                Timer.setTimeout(() => process.exit(-1), delay).unref();
                await super.stop();
            }
        }
        return AutoExit;
    }

export default autoExitDecorator;
