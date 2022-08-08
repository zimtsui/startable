import { State, Friendly, OnStopping, ReadyState } from './startable';
import { PublicManualPromise } from '@zimtsui/manual-promise';
export declare class Ready extends State {
    protected host: Friendly;
    protected promise: PublicManualPromise<void>;
    constructor(host: Friendly);
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<never>;
    stop(): Promise<void>;
    starp(err?: Error): Promise<never>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
    getStarting(): Promise<void>;
    getStopping(): Promise<void>;
}
export declare class CannotStarpDuringReady extends Error {
}
export declare class CannotAssartDuringReady extends Error {
}
export declare class CannotGetStartingDuringReady extends Error {
}
export declare class CannotGetStoppingDuringReady extends Error {
}
export declare class Starting extends State {
    protected host: Friendly;
    protected promise: PublicManualPromise<void>;
    private starting;
    private onStoppings;
    private startingError;
    constructor(host: Friendly, onStopping: OnStopping | null, promise: PublicManualPromise<void>);
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
    getStarting(): Promise<void>;
    getStopping(): Promise<void>;
}
export declare class StarpCalledDuringStarting extends Error {
}
export declare class CannotSkipStartDuringStarting extends Error {
}
export declare class CannotStopDuringStarting extends Error {
}
export declare class CannotGetStoppingDuringStarting extends Error {
}
export declare class Started extends State {
    protected host: Friendly;
    private starting;
    protected promise: PublicManualPromise<void>;
    private onStoppings;
    private startingError;
    constructor(host: Friendly, starting: PublicManualPromise<void>, promise: PublicManualPromise<void>, onStoppings: OnStopping[], startingError: Error | null);
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    stop(runningError?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
    getStarting(): Promise<void>;
    getStopping(): Promise<void>;
}
export declare class CannotSkipStartDuringStarted extends Error {
}
export declare class CannotGetStoppingDuringStarted extends Error {
}
export declare class Stopping extends State {
    protected host: Friendly;
    private starting;
    protected promise: PublicManualPromise<void>;
    private onStoppings;
    private startingError;
    private runningError;
    private stopping;
    constructor(host: Friendly, starting: Promise<void>, promise: PublicManualPromise<void>, onStoppings: OnStopping[], startingError: Error | null, runningError: Error | null);
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<never>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
    getStarting(): Promise<void>;
    getStopping(): Promise<void>;
}
export declare class CannotSkipStartDuringStopping extends Error {
}
export declare class CannotAssartDuringStopping extends Error {
}
export declare class CannotStartDuringStopping extends Error {
}
export declare class Stopped extends State {
    protected host: Friendly;
    private starting;
    private stopping;
    protected promise: PublicManualPromise<void>;
    private startingError;
    private runningError;
    private stoppingError;
    constructor(host: Friendly, starting: Promise<void>, stopping: PublicManualPromise<void>, promise: PublicManualPromise<void>, startingError: Error | null, runningError: Error | null, stoppingError: Error | null);
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<never>;
    stop(): Promise<void>;
    starp(err?: Error): Promise<never>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
    getStarting(): Promise<void>;
    getStopping(): Promise<void>;
}
export declare class CannotStartDuringStopped extends Error {
}
export declare class CannotSkipStartDuringStopped extends Error {
}
export declare class CannotStarpDuringStopped extends Error {
}
export declare class CannotAssartDuringStopped extends Error {
}
