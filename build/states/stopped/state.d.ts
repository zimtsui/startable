import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import { FactoryDeps } from './factory-deps';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { Args } from './args';
export declare class Stopped implements StateLike {
    private startable;
    private factories;
    [STATE_LIKE_NOMINAL]: void;
    private stoppingPromise;
    constructor(args: Args, startable: FriendlyStartableLike, factories: FactoryDeps);
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<never>;
    stop(): Promise<void>;
    starp(err?: Error): Promise<never>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
}
export declare class CannotStarpDuringStopped extends Error {
    constructor();
}
export declare class CannotAssartDuringStopped extends Error {
    constructor();
}
