import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { StoppingLike } from './stopping-like';
import { StoppedLike } from '../stopped/stopped-like';
export declare class Stopping implements StateLike {
    private startable;
    [STATE_LIKE_NOMINAL]: void;
    private startingPromise;
    private stoppingPromise;
    private onStoppings;
    constructor(args: StoppingLike.FactoryLike.Args, startable: FriendlyStartableLike<Stopping.FactoryDeps>);
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<never>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
}
export declare namespace Stopping {
    interface FactoryDeps {
        stopped: StoppedLike.FactoryLike;
    }
    class Factory implements StoppingLike.FactoryLike {
        private container;
        private startable;
        create(args: StoppingLike.FactoryLike.Args): Stopping;
    }
}
