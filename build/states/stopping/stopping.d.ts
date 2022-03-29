import { FriendlyStartable } from '../../friendly-startable';
import { OnStopping, ReadyState } from '../../startable-like';
import { StoppingLike } from './stopping-like';
export declare class Stopping implements StoppingLike {
    private startable;
    private startingPromise;
    private stoppingPromise;
    private onStoppings;
    private manualFailure;
    private stoppedFactory;
    constructor(args: Stopping.Args, startable: FriendlyStartable);
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
    export import Args = StoppingLike.FactoryLike.Args;
    class Factory implements StoppingLike.FactoryLike {
        private container;
        private startable;
        private stoppedFactory;
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
