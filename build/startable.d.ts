import { PublicManualPromise } from '@zimtsui/manual-promise';
export declare const enum ReadyState {
    READY = "READY",
    STARTING = "STARTING",
    STARTED = "STARTED",
    STOPPING = "STOPPING",
    STOPPED = "STOPPED"
}
export interface OnStopping {
    (err?: Error): void;
}
export declare abstract class Startable {
    protected abstract state: State;
    protected abstract rawStart: RawStart;
    protected abstract rawStop: RawStop;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getStarting(): Promise<void>;
    getStopping(): Promise<void>;
    getPromise(): Promise<void>;
}
export declare abstract class Friendly extends Startable {
    abstract state: State;
    abstract rawStart: RawStart;
    abstract rawStop: RawStop;
    abstract promise: PublicManualPromise<void>;
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
export declare abstract class State {
    protected abstract host: Startable;
    protected abstract promise: PublicManualPromise<void>;
    abstract postActivate(): void;
    abstract getReadyState(): ReadyState;
    abstract skipStart(onStopping?: OnStopping): void;
    abstract start(onStopping?: OnStopping): Promise<void>;
    abstract assart(onStopping?: OnStopping): Promise<void>;
    abstract stop(err?: Error): Promise<void>;
    abstract starp(err?: Error): Promise<void>;
    abstract getStarting(): Promise<void>;
    abstract getStopping(): Promise<void>;
    getPromise(): Promise<void>;
}
