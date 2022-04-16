import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike } from '../../state-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { StoppingLike } from './stopping-like';
import { StoppedLike } from '../stopped/stopped-like';
export declare class Stopping implements StateLike {
    private startable;
    private startingPromise;
    private stoppingPromise;
    private onStoppings;
    private manualFailure;
    static FactoryDeps: {};
    private factories;
    constructor(args: StoppingLike.FactoryLike.Args, startable: FriendlyStartableLike);
    private setup;
    start(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<never>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
}
export declare namespace Stopping {
    interface FactoryDeps {
        stopped: StoppedLike.FactoryLike;
    }
    class Factory implements StoppingLike.FactoryLike {
        private container;
        private factories;
        private startable;
        constructor();
        create(args: StoppingLike.FactoryLike.Args): Stopping;
    }
}
export declare class CannotStarpDuringStopping extends Error {
    constructor();
}
export declare class CannotSkipStartDuringStopping extends Error {
    constructor();
}
