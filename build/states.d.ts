import { State, Friendly, OnStopping, ReadyState } from './startable';
import { ManualPromise } from '@zimtsui/manual-promise';
export declare class Ready extends State {
    protected host: Friendly;
    constructor(host: Friendly, args: {});
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<never>;
    stop(): Promise<void>;
    starp(err?: Error): Promise<never>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
    getRunningPromise(): PromiseLike<void>;
}
export declare class CannotGetRunningPromiseDuringReady extends Error {
}
export declare class CannotStarpDuringReady extends Error {
}
export declare class CannotAssartDuringReady extends Error {
}
export declare class SkipFromReadyToStopped extends Error {
}
export declare class SkipFromReadytoStarted extends Error {
}
export declare class Starting extends State {
    protected host: Friendly;
    private startingPromise;
    private onStoppings;
    private startingError;
    constructor(host: Friendly, args: {
        onStopping: OnStopping | null;
    });
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
    getRunningPromise(): PromiseLike<void>;
}
export declare class CannotGetRunningPromiseDuringStarting extends Error {
}
export declare class StarpCalledDuringStarting extends Error {
}
export declare class CannotSkipStartDuringStarting extends Error {
}
export declare class CannotStopDuringStarting extends Error {
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
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    stop(runningError?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
    getRunningPromise(): PromiseLike<void>;
}
export declare class CannotSkipStartDuringStarted extends Error {
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
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<never>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
    getRunningPromise(): PromiseLike<void>;
}
export declare class CannotSkipStartDuringStopping extends Error {
}
export declare class CannotAssartDuringStopping extends Error {
}
export declare class Stopped extends State {
    protected host: Friendly;
    private startingPromise;
    private runningPromise;
    private stoppingPromise;
    private stoppingError;
    constructor(host: Friendly, args: {
        startingPromise: PromiseLike<void>;
        runningPromise: PromiseLike<void>;
        stoppingPromise: ManualPromise<void>;
        stoppingError: Error | null;
    });
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<never>;
    stop(): Promise<void>;
    starp(err?: Error): Promise<never>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
    getRunningPromise(): PromiseLike<void>;
}
export declare class CannotSkipStartDuringStopped extends Error {
}
export declare class CannotStarpDuringStopped extends Error {
}
export declare class CannotAssartDuringStopped extends Error {
}
