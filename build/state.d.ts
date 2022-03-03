import { StateLike, FriendlyStartableLike } from './friendly-startable-like';
import { OnStopping, ReadyState } from './startable-like';
export declare abstract class State implements StateLike {
    protected readonly startable: FriendlyStartableLike;
    constructor(startable: FriendlyStartableLike);
    abstract tryStart(onStopping?: OnStopping): Promise<void>;
    abstract tryStop(err?: Error): Promise<void>;
    abstract fail(err: Error): Promise<void>;
    abstract start(onStopping?: OnStopping): Promise<void>;
    abstract stop(err?: Error): Promise<void>;
    abstract getReadyState(): ReadyState;
    abstract skipStart(onStopping?: OnStopping): void;
}
export declare class CannotFail extends Error {
}
export declare class CannotSkipStart extends Error {
}
