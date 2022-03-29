import { FriendlyStartable } from '../../friendly-startable';
import { OnStopping, ReadyState, CannotFail, CannotSkipStart } from '../../startable-like';
import { StartedLike } from './started-like';
export declare class Started implements StartedLike {
    private startable;
    private startingPromise;
    private onStoppings;
    private stoppingFactory;
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
    export import Args = StartedLike.FactoryLike.Args;
    class Factory implements StartedLike.FactoryLike {
        private container;
        private stoppingFactory;
        private startable;
        constructor();
        create(args: Args): Started;
    }
}
export declare class CannotFailDuringStarted extends CannotFail {
    constructor();
}
export declare class CannotSkipStartDuringStarted extends CannotSkipStart {
    constructor();
}
