import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike } from '../../state-like';
import { StoppedLike } from './stopped-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { StartingLike } from '../starting/starting-like';
import { StartedLike } from '../started/started-like';
export declare class Stopped implements StateLike {
    private startable;
    private stoppingPromise;
    static FactoryDeps: {};
    private factories;
    constructor(args: StoppedLike.FactoryLike.Args, startable: FriendlyStartableLike);
    getStoppingPromise(): Promise<void>;
    start(onStopping?: OnStopping): Promise<void>;
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
