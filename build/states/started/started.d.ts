import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { StartedLike } from './started-like';
import { StoppingLike } from '../stopping/stopping-like';
export declare class Started implements StateLike {
    private startable;
    [STATE_LIKE_NOMINAL]: void;
    private startingPromise;
    private onStoppings;
    constructor(args: StartedLike.FactoryLike.Args, startable: FriendlyStartableLike<Started.FactoryDeps>);
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
        private startable;
        create(args: StartedLike.FactoryLike.Args): Started;
    }
}
