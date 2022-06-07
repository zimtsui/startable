import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { Args } from './args';
import { FactoryDeps } from './factory-deps';
export declare class Stopping implements StateLike {
    private startable;
    private factories;
    [STATE_LIKE_NOMINAL]: void;
    private startingPromise;
    private stoppingPromise;
    private onStoppings;
    constructor(args: Args, startable: FriendlyStartableLike, factories: FactoryDeps);
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<never>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
}
export declare namespace Stopping {
}
export declare class CannotSkipStartDuringStopping extends Error {
    constructor();
}
export declare class CannotAssartDuringStopping extends Error {
    constructor();
}
