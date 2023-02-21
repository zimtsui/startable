import { StartableLike, ReadyState, OnStopping, RawStart, RawStop } from './interfaces';
import * as Interfaces from './interfaces';
import { ManualPromise } from '@zimtsui/manual-promise';
export declare abstract class State implements StartableLike {
    protected abstract host: Friendly;
    abstract activate(): void;
    abstract getState(): ReadyState;
    abstract start(onStopping?: OnStopping): PromiseLike<void>;
    abstract skart(err?: Error): void;
    abstract stop(err?: Error): Promise<void>;
    abstract getRunning(): PromiseLike<void>;
    abstract assertState(expected: ReadyState[]): void;
}
export interface Startable extends StartableLike {
    getState(): ReadyState;
    /**
     * @throws {@link StateError}
     * @defaultValue `[ReadyState.STARTED]`
     */
    assertState(expected: ReadyState[]): void;
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
export declare namespace Startable {
    function create(rawStart: RawStart, rawStop: RawStop): Startable;
    export import RawStart = Interfaces.RawStart;
    export import RawStop = Interfaces.RawStop;
    export import OnStopping = Interfaces.OnStopping;
    export import ReadyState = Interfaces.ReadyState;
    export import StateError = Interfaces.StateError;
}
export declare class Friendly implements Startable {
    rawStart: RawStart;
    rawStop: RawStop;
    state: State;
    constructor(rawStart: RawStart, rawStop: RawStop);
    getState(): ReadyState;
    assertState(expected: ReadyState[]): void;
    skart(startingError?: Error): void;
    start(onStopping?: OnStopping): PromiseLike<void>;
    stop(err?: Error): Promise<void>;
    getRunning(): PromiseLike<void>;
}
export declare class Ready extends State {
    protected host: Friendly;
    constructor(host: Friendly, options: {});
    activate(): void;
    assertState(expected: ReadyState[]): void;
    start(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    getState(): ReadyState;
    skart(err?: Error): void;
    getRunning(): PromiseLike<void>;
}
export declare class Starting extends State {
    protected host: Friendly;
    private startingPromise;
    private onStoppings;
    private startingErrors;
    constructor(host: Friendly, options: {
        onStopping: OnStopping | null;
    });
    assertState(expected: ReadyState[]): void;
    activate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    getState(): ReadyState;
    skart(err?: Error): never;
    getRunning(): PromiseLike<void>;
}
export declare class Started extends State {
    protected host: Friendly;
    private running;
    private startingPromise;
    private onStoppings;
    private startingError;
    constructor(host: Friendly, args: {
        startingPromise: ManualPromise<void>;
        onStoppings: OnStopping[];
        startingError: Error | null;
    });
    assertState(expected: ReadyState[]): void;
    activate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    stop(runningError?: Error): Promise<void>;
    getState(): ReadyState;
    skart(err?: Error): never;
    getRunning(): PromiseLike<void>;
}
export declare class Stopping extends State {
    protected host: Friendly;
    private startingPromise;
    private runningPromise;
    private stoppingPromise;
    private onStoppings;
    private runningError;
    private stoppingError;
    constructor(host: Friendly, args: {
        startingPromise: PromiseLike<void>;
        runningPromise: PromiseLike<void>;
        onStoppings: OnStopping[];
        runningError: Error | null;
    });
    assertState(expected: ReadyState[]): void;
    activate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    getState(): ReadyState;
    skart(err?: Error): never;
    getRunning(): PromiseLike<void>;
}
export declare class Stopped extends State {
    protected host: Friendly;
    private startingPromise;
    private runningPromise;
    private stoppingPromise;
    private stoppingError;
    constructor(host: Friendly, args: {
        startingPromise: PromiseLike<void> | null;
        runningPromise: PromiseLike<void> | null;
        stoppingPromise: ManualPromise<void>;
        stoppingError: Error | null;
    });
    assertState(expected: ReadyState[]): void;
    activate(): void;
    start(onStopping?: OnStopping): PromiseLike<void>;
    stop(): Promise<void>;
    getState(): ReadyState;
    skart(err?: Error): void;
    getRunning(): PromiseLike<void>;
}
