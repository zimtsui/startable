import { OnStopping, ReadyState } from '../../startable-like';
import { FriendlyStartable } from '../../friendly-startable';
import { StartedLike } from './started-like';
import { StoppingLike } from '../stopping/stopping-like';
export declare class Started implements StartedLike {
    private startable;
    private startingPromise;
    private onStoppings;
    static FactoryDeps: {};
    private factories;
    constructor(args: Started.Args, startable: FriendlyStartable);
    getStartingPromise(): Promise<void>;
    tryStart(onStopping?: OnStopping): Promise<void>;
    start(onStopping?: OnStopping): Promise<void>;
    tryStop(err?: Error): Promise<void>;
    stop(err?: Error): Promise<void>;
    fail(err: Error): Promise<never>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
}
export declare namespace Started {
    interface FactoryDeps {
        stopping: StoppingLike.FactoryLike;
    }
    export import Args = StartedLike.FactoryLike.Args;
    class Factory implements StartedLike.FactoryLike {
        private container;
        private factories;
        private startable;
        constructor();
        create(args: Args): Started;
    }
}
export declare class CannotFailDuringStarted extends Error {
    constructor();
}
export declare class CannotSkipStartDuringStarted extends Error {
    constructor();
}
