import { StartableLike, ReadyState, OnStopping } from './startable-like';
export declare abstract class Startable<StartArgs extends unknown[]> implements StartableLike<StartArgs> {
    protected abstract state: State<StartArgs>;
    protected abstract rawStart: RawStart<StartArgs>;
    protected abstract rawStop: RawStop;
    getReadyState: () => ReadyState;
    skipStart: (onStopping?: OnStopping | undefined) => void;
    start: (startArgs: StartArgs, onStopping?: OnStopping | undefined) => Promise<void>;
    assart: (onStopping?: OnStopping | undefined) => Promise<void>;
    stop: (err?: Error | undefined) => Promise<void>;
    starp: (err?: Error | undefined) => Promise<void>;
}
export declare abstract class Friendly<StartArgs extends unknown[]> extends Startable<StartArgs> {
    abstract state: State<StartArgs>;
    abstract rawStart: RawStart<StartArgs>;
    abstract rawStop: RawStop;
}
export interface RawStart<StartArgs extends unknown[]> {
    (...args: StartArgs): Promise<void>;
}
export interface RawStop {
    (err?: Error): Promise<void>;
}
export declare abstract class State<StartArgs extends unknown[]> {
    protected abstract host: Startable<StartArgs>;
    abstract postActivate(): void;
    abstract getReadyState(): ReadyState;
    abstract skipStart(onStopping?: OnStopping): void;
    abstract start(startArgs: StartArgs, onStopping?: OnStopping): Promise<void>;
    abstract assart(onStopping?: OnStopping): Promise<void>;
    abstract stop(err?: Error): Promise<void>;
    abstract starp(err?: Error): Promise<void>;
}
