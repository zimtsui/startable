import { StartableLike, ReadyState, OnStopping } from './startable-like';
import { ManualPromise } from '@zimtsui/manual-promise';
export declare abstract class Startable extends ManualPromise<void> implements StartableLike {
    protected abstract state: State;
    protected abstract rawStart: RawStart;
    protected abstract rawStop: RawStop;
    constructor();
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getStarting(): Promise<void>;
    getStopping(): Promise<void>;
}
export declare abstract class Friendly extends Startable {
    abstract state: State;
    abstract rawStart: RawStart;
    abstract rawStop: RawStop;
    abstract resolve: (value: void) => void;
    abstract reject: (err: Error) => void;
}
/**
 * @throws Error
 */
export interface RawStart {
    (): Promise<void>;
}
/**
 * @throws Error
 */
export interface RawStop {
    (err?: Error): Promise<void>;
}
export declare abstract class State implements StartableLike {
    protected abstract host: Startable;
    abstract postActivate(): void;
    abstract getReadyState(): ReadyState;
    abstract skipStart(onStopping?: OnStopping): void;
    abstract start(onStopping?: OnStopping): Promise<void>;
    abstract assart(onStopping?: OnStopping): Promise<void>;
    abstract stop(err?: Error): Promise<void>;
    abstract starp(err?: Error): Promise<void>;
    abstract getStarting(): Promise<void>;
    abstract getStopping(): Promise<void>;
}
