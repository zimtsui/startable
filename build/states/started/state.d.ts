import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { FactoryDeps } from './factory-deps';
import { Args } from './args';
export declare class Started implements StateLike {
    private startable;
    private factories;
    [STATE_LIKE_NOMINAL]: void;
    private startingPromise;
    private onStoppings;
    constructor(args: Args, startable: FriendlyStartableLike, factories: FactoryDeps);
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
}
export declare class CannotSkipStartDuringStarted extends Error {
    constructor();
}
