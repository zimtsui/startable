import { ManualPromise } from '@zimtsui/manual-promise';
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
    /**
     * Skip from READY to STARTED.
     * @decorator `@boundMethod`
     */
    skipStart(onStopping?: OnStopping): void;
    /**
     * - If it's READY now, then
     * 1. Start.
     * 1. Wait until STARTED.
     * - If it's STARTING or STARTED now, then
     * 1. Wait until STARTED.
     * @decorator `@boundMethod`
     * @decorator `@catchThrow()`
     */
    start(onStopping?: OnStopping): Promise<void>;
    /**
     * 1. Assert it's STARTING or STARTED now.
     * 1. Wait until STARTED.
     * @decorator `@boundMethod`
     * @decorator `@catchThrow()`
     */
    assart(onStopping?: OnStopping): Promise<void>;
    /**
     * - If it's STARTED now, then
     * 1. Stop.
     * 1. Wait until STOPPED.
     * - If it's STOPPING or STOPPED now, then
     * 1. Wait until STOPPED.
     * @decorator `@boundMethod`
     * @decorator `@catchThrow()`
     */
    stop(err?: Error): Promise<void>;
    /**
     * If it's STARTING now, then
     * 1. Wait until STARTED.
     * 1. Stop.
     * @decorator `@boundMethod`
     * @decorator `@catchThrow()`
     */
    starp(err?: Error): Promise<void>;
    getStarting(): PromiseLike<void>;
    getStopping(): PromiseLike<void>;
    getPromise(): PromiseLike<void>;
}
export declare abstract class Friendly extends Startable {
    abstract state: State;
    abstract rawStart: RawStart;
    abstract rawStop: RawStop;
    abstract promise: ManualPromise<void>;
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
    protected abstract promise: ManualPromise<void>;
    abstract postActivate(): void;
    abstract getReadyState(): ReadyState;
    abstract skipStart(onStopping?: OnStopping): void;
    abstract start(onStopping?: OnStopping): Promise<void>;
    abstract assart(onStopping?: OnStopping): Promise<void>;
    abstract stop(err?: Error): Promise<void>;
    abstract starp(err?: Error): Promise<void>;
    abstract getStarting(): PromiseLike<void>;
    abstract getStopping(): PromiseLike<void>;
    getPromise(): PromiseLike<void>;
}
