import { AssertionError } from 'assert';
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
     * @throws StateError
     */
    assertReadyState(action: string, expected?: ReadyState[]): void;
    /**
     * Skip from READY to STARTED.
     */
    skart(startingError?: Error): void;
    /**
     * - If it's READY now, then
     * 1. Start.
     * 1. Return the promise of STARTING.
     * - Otherwise,
     * 1. Return the promise of STARTING.
     * @decorator `@boundMethod`
     * @throws ReferenceError
     */
    start(onStopping?: OnStopping): PromiseLike<void>;
    /**
     * - If it's READY now, then
     * 1. Skip to STOPPED.
     * - If it's STARTING now and `err` is given, then
     * 1. Make the STARTING process throw `err`.
     * - If it's STARTING now and `err` is not given, then
     * 1. Wait until STARTED.
     * 1. Stop.
     * 1. Wait until STOPPED.
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
     * @throws ReferenceError
     */
    getRunningPromise(): PromiseLike<void>;
}
export declare abstract class Friendly extends Startable {
    abstract state: State;
    abstract rawStart: RawStart;
    abstract rawStop: RawStop;
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
    abstract postActivate(): void;
    abstract getReadyState(): ReadyState;
    abstract start(onStopping?: OnStopping): PromiseLike<void>;
    abstract skart(err?: Error): void;
    abstract stop(err?: Error): Promise<void>;
    abstract getRunningPromise(): PromiseLike<void>;
}
export declare class StateError extends AssertionError {
    action: string;
    constructor(action: string, actualState: ReadyState, expectedStates?: ReadyState[]);
}
