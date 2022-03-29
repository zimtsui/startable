import { OnStopping, ReadyState } from '../../startable-like';
import { StartingLike } from './starting-like';
import { FriendlyStartable } from '../../friendly-startable';
export declare class Starting implements StartingLike {
    private startable;
    private startingPromise;
    private onStoppings;
    private manualFailure;
    private startedFactory;
    constructor(args: Starting.Args, startable: FriendlyStartable);
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
    export import Args = StartingLike.FactoryLike.Args;
    class Factory implements StartingLike.FactoryLike {
        private container;
        private startedFactory;
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
