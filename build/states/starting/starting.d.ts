import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike } from '../../state-like';
import { StartingLike } from './starting-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { StartedLike } from '../started/started-like';
export declare class Starting implements StateLike {
    private startable;
    private startingPromise;
    private stoppingPromise;
    private onStoppings;
    private manualFailure;
    static FactoryDeps: {};
    private factories;
    constructor(args: StartingLike.FactoryLike.Args, startable: FriendlyStartableLike);
    private setup;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
}
export declare namespace Starting {
    interface FactoryDeps {
        started: StartedLike.FactoryLike;
    }
    class Factory implements StartingLike.FactoryLike {
        private container;
        private factories;
        private startable;
        constructor();
        create(args: StartingLike.FactoryLike.Args): Starting;
    }
}
export declare class StarpCalledDuringStarting extends Error {
    constructor();
}
export declare class CannotSkipStartDuringStarting extends Error {
    constructor();
}
