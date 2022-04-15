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
    tryStart(onStopping?: OnStopping): Promise<void>;
    start(onStopping?: OnStopping): Promise<void>;
    tryStop(err?: Error): Promise<void>;
    stop(err?: Error): Promise<void>;
    fail(err: Error): Promise<void>;
}
