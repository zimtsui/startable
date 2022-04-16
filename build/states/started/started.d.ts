import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike } from '../../state-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { StartedLike } from './started-like';
import { StoppingLike } from '../stopping/stopping-like';
export declare class Started implements StateLike {
    private startable;
    private startingPromise;
    private onStoppings;
    static FactoryDeps: {};
    private factories;
    constructor(args: StartedLike.FactoryLike.Args, startable: FriendlyStartableLike);
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
}
export declare namespace Started {
    interface FactoryDeps {
        stopping: StoppingLike.FactoryLike;
    }
    class Factory implements StartedLike.FactoryLike {
        private container;
        private factories;
        private startable;
        constructor();
        create(args: StartedLike.FactoryLike.Args): Started;
    }
}
export declare class CannotSkipStartDuringStarted extends Error {
    constructor();
}
