import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { StartingLike } from './starting-like';
import { StartedLike } from '../started/started-like';
export declare class Starting implements StateLike {
    private startable;
    [STATE_LIKE_NOMINAL]: void;
    private startingPromise;
    private stoppingPromise;
    private onStoppings;
    private manualFailure;
    constructor(args: StartingLike.FactoryLike.Args, startable: FriendlyStartableLike<Starting.FactoryDeps>);
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
        private startable;
        create(args: StartingLike.FactoryLike.Args): Starting;
    }
}
export declare class StarpCalledDuringStarting extends Error {
    constructor();
}
