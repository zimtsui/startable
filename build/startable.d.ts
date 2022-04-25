import { RawStart, RawStop, StartableLike, OnStopping, ReadyState } from './startable-like';
export declare class Startable implements StartableLike {
    private friendly;
    constructor(rawStart: RawStart, rawStop: RawStop);
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
}
