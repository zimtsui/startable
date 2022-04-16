import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_TYPE } from '../../state-like';
import { StoppedLike } from './stopped-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { StartingLike } from '../starting/starting-like';
import { StartedLike } from '../started/started-like';
export declare class Stopped implements StateLike {
    private startable;
    [STATE_LIKE_TYPE]: void;
    private stoppingPromise;
    static FactoryDeps: {};
    private factories;
    constructor(args: StoppedLike.FactoryLike.Args, startable: FriendlyStartableLike);
    getStoppingPromise(): Promise<void>;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<never>;
    stop(): Promise<never>;
    starp(err?: Error): Promise<never>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
}
export declare namespace Stopped {
    interface FactoryDeps {
        starting: StartingLike.FactoryLike;
        started: StartedLike.FactoryLike;
    }
    class Factory implements StoppedLike.FactoryLike {
        private container;
        private factories;
        private startable;
        constructor();
        create(args: StoppedLike.FactoryLike.Args): Stopped;
    }
}
export declare class CannotStarpDuringStopped extends Error {
    constructor();
}
export declare class CannotAssartDuringStopped extends Error {
    constructor();
}
