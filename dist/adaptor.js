function adaptor(service, startTimeout = 0, stopTimeout = 0) {
    let startTimer;
    if (startTimeout)
        startTimer = setTimeout(() => void process.exit(1), startTimeout);
    service.start(err => {
        if (err)
            console.error(err);
        if (stopTimeout)
            setTimeout(() => void process.exit(1), stopTimeout).unref();
        service.stop().then(() => {
            process.exitCode = 0;
        }, err => {
            console.error(err);
            process.exitCode = 1;
        });
    }).finally(() => {
        if (startTimeout)
            clearTimeout(startTimer);
    }).catch(err => {
        console.error(err);
        service.stop().catch(() => { });
    });
    process.once('SIGINT', () => {
        process.once('SIGINT', () => void process.exit(1));
        service.stop().catch(() => { });
    });
}
export { adaptor as default, adaptor, };
//# sourceMappingURL=adaptor.js.map