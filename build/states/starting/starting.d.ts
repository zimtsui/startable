import { OnStopping, ReadyState } from '../../startable-like';
import { StartingLike } from './starting-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { StartedLike } from '../started/started-like';
export declare class Starting implements StartingLike {
    private startable;
    private startingPromise;
    private onStoppings;
    private manualFailure;
    static FactoryDeps: {};
    private factories;
    constructor(args: Starting.Args, startable: FriendlyStartableLike);
    getStartingPromise(): Promise<void>;
    private setup;
    tryStart(onStopping?: OnStopping): Promise<void>;
    start(onStopping?: OnStopping): Promise<void>;
    tryStop(err?: Error): Promise<never>;
    stop(err?: Error): Promise<void>;
    fail(err: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
}
export declare namespace Starting {
    interface FactoryDeps {
        started: StartedLike.FactoryLike;
    }
    export import Args = StartingLike.FactoryLike.Args;
    class Factory implements StartingLike.FactoryLike {
        private container;
        private factories;
        private startable;
        constructor();
        create(args: Args): Starting;
    }
}
export declare class StopCalledDuringStarting extends Error {
    constructor();
}
export declare class CannotTryStopDuringStarting extends Error {
    constructor();
}
export declare class CannotSkipStartDuringStarting extends Error {
    constructor();
}
