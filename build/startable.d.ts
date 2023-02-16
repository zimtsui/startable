import { AssertionError } from 'assert';
export declare enum ReadyState {
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
    getState(): ReadyState;
    /**
     * @throws {@link StateError}
     * @defaultValue `[ReadyState.STARTED]`
     */
    assertState(expected?: ReadyState[]): void;
    /**
     * Skip from `READY` to `STARTED`.
     */
    skart(startingError?: Error): void;
    /**
     * 1. If it's `READY` now, then
     * 	1. Start.
     * 1. Return the promise of `STARTING`.
     * @decorator `@boundMethod`
     * @throws ReferenceError
     */
    start(onStopping?: OnStopping): PromiseLike<void>;
    /**
     * - If it's `READY` now, then
     * 	1. Skip to `STOPPED`.
     * - If it's `STARTING` now and `err` is given, then
     * 	1. Make the `STARTING` process throw `err`.
     * - Otherwise,
     * 	1. If it's `STARTING` now and `err` is not given, then
     * 		1. Wait until `STARTED`.
     * 	1. If it's `STARTED` now, then
     * 		1. Stop.
     * 	1. If it's `STOPPING` or `STOPPED` now, then
     * 		1. Return the promise of `STOPPING`.
     * @decorator `@boundMethod`
     * @decorator `@catchThrow()`
     */
    stop(err?: Error): Promise<void>;
    /**
     * @throws ReferenceError
     */
    getRunning(): PromiseLike<void>;
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
    abstract getState(): ReadyState;
    abstract start(onStopping?: OnStopping): PromiseLike<void>;
    abstract skart(err?: Error): void;
    abstract stop(err?: Error): Promise<void>;
    abstract getRunning(): PromiseLike<void>;
}
export declare class StateError extends AssertionError {
    constructor(actual: ReadyState, expected?: ReadyState[]);
}
