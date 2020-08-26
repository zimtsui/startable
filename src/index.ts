process.on('unhandledRejection', (reason, promise) => {
    promise.catch(() => { });
});

export { default } from './startable';
export * from './startable';