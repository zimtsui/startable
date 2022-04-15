import { OnStopping, ReadyState } from '../../startable-like';
import { StoppedLike } from './stopped-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { StartingLike } from '../starting/starting-like';
import { StartedLike } from '../started/started-like';
export declare class Stopped implements StoppedLike {
    private startable;
    private stoppingPromise;
    static FactoryDeps: {};
    private factories;
    constructor(args: StoppedLike.FactoryLike.Args, startable: FriendlyStartableLike);
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
    interface FactoryDeps {
        starting: StartingLike.FactoryLike;
        started: StartedLike.FactoryLike;
    }
    import FactoryLike = StoppedLike.FactoryLike;
    import Args = StoppedLike.FactoryLike.Args;
    class Factory implements FactoryLike {
        private container;
        private factories;
        private startable;
        constructor();
        create(args: Args): Stopped;
    }
}
export declare class CannotFailDuringStopped extends Error {
    constructor();
}
