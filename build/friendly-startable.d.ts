import { StateLike, Factories, FriendlyStartableLike } from './friendly-startable-like';
import { OnStopping, RawStart, RawStop, ReadyState } from './startable-like';
export declare class FriendlyStartable implements FriendlyStartableLike {
    readonly rawStart: RawStart;
    readonly rawStop: RawStop;
    readonly factories: Factories;
    constructor(rawStart: RawStart, rawStop: RawStop);
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
    state: StateLike;
    tryStart(onStopping?: OnStopping): Promise<void>;
    start(onStopping?: OnStopping): Promise<void>;
    tryStop(err?: Error): Promise<void>;
    stop(err?: Error): Promise<void>;
    fail(err: Error): Promise<void>;
}
