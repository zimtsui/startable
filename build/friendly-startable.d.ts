import { OnStopping, RawStart, RawStop, ReadyState, StartableLike } from './startable-like';
import { StateLike } from './state-like';
export declare class FriendlyStartable implements StartableLike {
    rawStart: RawStart;
    rawStop: RawStop;
    private container;
    private state;
    private factories;
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
