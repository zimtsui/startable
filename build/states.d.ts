import { Startable, State, Friendly } from './startable';
import { OnStopping, ReadyState } from './startable-like';
export declare class Ready extends State {
    protected host: Friendly;
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
    private starting;
    private onStoppings;
    private err;
    constructor(host: Friendly, onStopping?: OnStopping);
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
    private onStoppings;
    constructor(host: Friendly, starting: Promise<void>, onStoppings: OnStopping[]);
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
export declare class CannotSkipStartDuringStarted extends Error {
}
export declare class CannotGetStoppingDuringStarted extends Error {
}
export declare class Stopping extends State {
    protected host: Friendly;
    private starting;
    private onStoppings;
    private err?;
    private stopping;
    constructor(host: Friendly, starting: Promise<void>, onStoppings: OnStopping[], err?: Error | undefined);
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
    protected host: Startable;
    private stopping;
    constructor(host: Startable, stopping: Promise<void>);
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
export declare class CannotGetStartingDuringStopped extends Error {
}
