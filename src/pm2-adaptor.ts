import { StartableLike } from './startable';
import Bluebird from 'bluebird';

const PRODUCTION = process.env.NODE_ENV === 'production';

function pm2Adaptor(service: StartableLike) {
    service.start(err => {
        if (err) {
            console.error(err);
            service.stop().then(() => {
                process.exit(0);
            }, () => {
                process.exit(1);
            });
        }
    }).then(() => {
        if (PRODUCTION) process.send!('ready');
    });
    process.on('SIGINT', () => {
        service.stop().catch(async err => {
            console.error(err);
            await Bluebird.delay(1000);
            process.exit(1);
        });
    });
}

export {
    pm2Adaptor as default,
    pm2Adaptor,
}
