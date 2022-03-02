import { State } from '../state';
import { FriendlyStartableLike, FactoryLike, StateLike } from '../friendly-startable-like';
import { OnStopping, ReadyState } from '../startable-like';
export declare class Stopping extends State implements StateLike.Stopping {
    protected readonly startable: FriendlyStartableLike;
    private readonly startingPromise;
    private readonly stoppingPromise;
    private onStoppings;
    private manualFailure;
    constructor(startable: FriendlyStartableLike, args: Stopping.Args);
    getStartingPromise(): Promise<void>;
    getStoppingPromise(): Promise<void>;
    private setup;
    tryStart(onStopping?: OnStopping): Promise<never>;
    start(onStopping?: OnStopping): Promise<void>;
    tryStop(err?: Error): Promise<void>;
    stop(err?: Error): Promise<void>;
    fail(err: Error): Promise<void>;
    getReadyState(): ReadyState;
}
export declare namespace Stopping {
    export import Args = FactoryLike.Stopping.Args;
    class Factory implements FactoryLike.Stopping {
        protected startable: FriendlyStartableLike;
        constructor(startable: FriendlyStartableLike);
        create(args: Args): Stopping;
    }
}
export declare class CannotTryStartDuringStopping extends Error {
    constructor();
}
