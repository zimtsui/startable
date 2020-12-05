import { StartableLike } from './startable';

function adaptor(service: StartableLike) {
    service.start(err => {
        if (err) console.error(err);
        service.stop().then(() => {
            process.exitCode = 0;
        }, err => {
            console.error(err);
            process.exitCode = 1;
        }).then(() => {
            setTimeout(
                () => void process.exit(),
                1000,
            ).unref();
        });
    }).catch(err => {
        console.error(err);
        service.stop().catch(() => { });
    });
    process.once('SIGINT', () => {
        process.once('SIGINT', () => void process.exit(1));
        service.stop().catch(() => { });
    });
}

export {
    adaptor as default,
    adaptor,
}
