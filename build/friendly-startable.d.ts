import { OnStopping, RawStart, RawStop, ReadyState, StartableLike } from './startable-like';
export declare class FriendlyStartable implements StartableLike {
    rawStart: RawStart;
    rawStop: RawStop;
    private container;
    private state;
    constructor(rawStart: RawStart, rawStop: RawStop);
    setState(state: StartableLike): void;
    getState(): StartableLike;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
    start(onStopping?: OnStopping): Promise<void>;
    starp(err?: Error): Promise<void>;
    stop(err?: Error): Promise<void>;
}
