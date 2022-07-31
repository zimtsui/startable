import { StartableLike, ReadyState, OnStopping } from './startable-like';
export declare abstract class Startable implements StartableLike {
    protected abstract state: State;
    protected abstract rawStart: RawStart;
    protected abstract rawStop: RawStop;
    getReadyState: () => ReadyState;
    skipStart: (onStopping?: OnStopping | undefined) => void;
    start: (onStopping?: OnStopping | undefined) => Promise<void>;
    assart: (onStopping?: OnStopping | undefined) => Promise<void>;
    stop: (err?: Error | undefined) => Promise<void>;
    starp: (err?: Error | undefined) => Promise<void>;
}
export declare abstract class Friendly extends Startable {
    abstract state: State;
    abstract rawStart: RawStart;
    abstract rawStop: RawStop;
}
export interface RawStart {
    (): Promise<void>;
}
export interface RawStop {
    (err?: Error): Promise<void>;
}
export declare abstract class State {
    protected abstract host: Startable;
    abstract postActivate(): void;
    abstract getReadyState(): ReadyState;
    abstract skipStart(onStopping?: OnStopping): void;
    abstract start(onStopping?: OnStopping): Promise<void>;
    abstract assart(onStopping?: OnStopping): Promise<void>;
    abstract stop(err?: Error): Promise<void>;
    abstract starp(err?: Error): Promise<void>;
}
