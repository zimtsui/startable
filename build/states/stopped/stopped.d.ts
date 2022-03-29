import { OnStopping, ReadyState } from '../../startable-like';
import { StoppedLike } from './stopped-like';
import { FriendlyStartable } from '../../friendly-startable';
export declare class Stopped implements StoppedLike {
    private startable;
    private stoppingPromise;
    private startingFactory;
    private startedFactory;
    constructor(args: StoppedLike.FactoryLike.Args, startable: FriendlyStartable);
    getStoppingPromise(): Promise<void>;
    tryStart(onStopping?: OnStopping): Promise<void>;
    start(onStopping?: OnStopping): Promise<void>;
    tryStop(err?: Error): Promise<void>;
    stop(): Promise<void>;
    fail(err: Error): Promise<never>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
}
export declare namespace Stopped {
    import FactoryLike = StoppedLike.FactoryLike;
    import Args = StoppedLike.FactoryLike.Args;
    class Factory implements FactoryLike {
        private container;
        private startingFactory;
        private startedFactory;
        private startable;
        constructor();
        create(args: Args): Stopped;
    }
}
export declare class CannotFailDuringStopped extends Error {
    constructor();
}
