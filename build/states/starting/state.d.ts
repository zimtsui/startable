import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { FactoryDeps } from './factory-deps';
import { Args } from './args';
export declare class Starting implements StateLike {
    private startable;
    private factories;
    [STATE_LIKE_NOMINAL]: void;
    private startingPromise;
    private stoppingPromise;
    private onStoppings;
    private manualFailure;
    constructor(args: Args, startable: FriendlyStartableLike, factories: FactoryDeps);
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
}
export declare class StarpCalledDuringStarting extends Error {
    constructor();
}
export declare class CannotSkipStartDuringStarting extends Error {
    constructor();
}
