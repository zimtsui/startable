import { OnStopping, ReadyState } from '../../startable-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { StoppingLike } from './stopping-like';
import { StoppedLike } from '../stopped/stopped-like';
export declare class Stopping implements StoppingLike {
    private startable;
    private startingPromise;
    private stoppingPromise;
    private onStoppings;
    private manualFailure;
    static FactoryDeps: {};
    private factories;
    constructor(args: Stopping.Args, startable: FriendlyStartableLike);
    getStartingPromise(): Promise<void>;
    getStoppingPromise(): Promise<void>;
    private setup;
    tryStart(onStopping?: OnStopping): Promise<never>;
    start(onStopping?: OnStopping): Promise<void>;
    tryStop(err?: Error): Promise<void>;
    stop(err?: Error): Promise<void>;
    fail(err: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
}
export declare namespace Stopping {
    interface FactoryDeps {
        stopped: StoppedLike.FactoryLike;
    }
    export import Args = StoppingLike.FactoryLike.Args;
    class Factory implements StoppingLike.FactoryLike {
        private container;
        private factories;
        private startable;
        constructor();
        create(args: Args): Stopping;
    }
}
export declare class CannotTryStartDuringStopping extends Error {
    constructor();
}
export declare class CannotSkipStartDuringStopping extends Error {
    constructor();
}
