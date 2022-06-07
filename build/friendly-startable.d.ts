import { OnStopping, RawStart, RawStop, ReadyState } from './startable-like';
import { StateLike } from './state-like';
import { FriendlyStartableLike } from './friendly-startable-like';
export declare class FriendlyStartable implements FriendlyStartableLike {
    rawStart: RawStart;
    rawStop: RawStop;
    private state;
    constructor(rawStart: RawStart, rawStop: RawStop);
    setState(state: StateLike): void;
    getState(): StateLike;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    starp(err?: Error): Promise<void>;
    stop(err?: Error): Promise<void>;
}
