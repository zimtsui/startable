import { State } from '../state';
import { FriendlyStartableLike, FactoryLike, StateLike } from '../friendly-startable-like';
import { OnStopping, ReadyState } from '../startable-like';
export declare class Starting extends State implements StateLike.Starting {
    protected readonly startable: FriendlyStartableLike;
    private readonly startingPromise;
    private onStoppings;
    private manualFailure;
    constructor(startable: FriendlyStartableLike, args: Starting.Args);
    getStartingPromise(): Promise<void>;
    private setup;
    tryStart(onStopping?: OnStopping): Promise<void>;
    start(onStopping?: OnStopping): Promise<void>;
    tryStop(err?: Error): Promise<never>;
    stop(err?: Error): Promise<void>;
    fail(err: Error): Promise<void>;
    getReadyState(): ReadyState;
}
export declare namespace Starting {
    export import Args = FactoryLike.Starting.Args;
    class Factory implements FactoryLike.Starting {
        protected startable: FriendlyStartableLike;
        constructor(startable: FriendlyStartableLike);
        create(args: Args): Starting;
    }
}
export declare class StopCalledDuringStarting extends Error {
    constructor();
}
export declare class CannotTryStopDuringStarting extends Error {
    constructor();
}
