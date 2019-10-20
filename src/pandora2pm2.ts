import {
    Service,
    Autonomous,
} from './autonomous';
import {
    setTimeout,
    clearTimeout,
} from 'timers';
import process from 'process';
import { consoleErrorSync } from './console-error-sync'

const DEV = !process.send;

const DEFAULT_EXIT_TIMEOUT = 1000;
const DEFAULT_STOP_TIMEOUT = 5000;

interface ServiceCtor {
    new(): Service;
}

/*
    几个问题
    1. stop 总不结束怎么办
    2. stop 结束之后进程总不结束怎么办。说明有东西没 unref 干净
*/

async function pandora2Pm2(Services: ServiceCtor[]): Promise<void> {
    try {
        const services = Services.map(Services => new Services());

        let stopping: Promise<void>;
        async function stop(): Promise<void> {
            if (DEV) console.log('stopping');
            if (!stopping) stopping = services
                .reverse()
                .reduce(
                    (stopped, service) => stopped
                        .then(() => service.stop()),
                    Promise.resolve(),
                );

            const timer = setTimeout(() => {
                consoleErrorSync('stop times out');
                process.exit(1);
            }, process.env.STOP_TIMEOUT
                ? Number.parseInt(process.env.STOP_TIMEOUT)
                : DEFAULT_STOP_TIMEOUT,
            );

            await stopping.catch(err => {
                consoleErrorSync(err);
                process.exit(1);
            });

            clearTimeout(timer);
            if (DEV) console.log('stopped');

            setTimeout(() => {
                consoleErrorSync('exit times out');
                process.exit(0);
            }, process.env.EXIT_TIMEOUT
                ? Number.parseInt(process.env.EXIT_TIMEOUT)
                : DEFAULT_EXIT_TIMEOUT,
            ).unref();
        }

        process.once('SIGINT', async () => {
            process.once('SIGINT', () => {
                consoleErrorSync('forced to exit');
                process.exit(1);
            });
            await stop();
        });

        if (DEV) console.log('starting');

        for (const service of services)
            if (service instanceof Autonomous)
                await service.start(stop);
            else await service.start();

        if (DEV) console.log('started');
        else process.send!('ready');
    } catch (err) {
        consoleErrorSync(err);
        process.exit(1);
    }
}

export default pandora2Pm2;
export { pandora2Pm2 };