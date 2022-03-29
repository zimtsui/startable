import { OnStopping, RawStart, RawStop, StartableLike, ReadyState } from './startable-like';
export declare class Startable implements StartableLike {
    private friendly;
    private container;
    constructor(rawStart: RawStart, rawStop: RawStop);
    getReadyState(): ReadyState;
    tryStart(onStopping?: OnStopping): Promise<void>;
    start(onStopping?: OnStopping): Promise<void>;
    tryStop(err?: Error): Promise<void>;
    stop(err?: Error): Promise<void>;
    fail(err: Error): Promise<void>;
    skipStart(onStopping?: OnStopping): void;
}
