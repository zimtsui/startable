import { State, Friendly, OnStopping, ReadyState } from './startable';
import { ManualPromise } from '@zimtsui/manual-promise';
export declare class Ready extends State {
    protected host: Friendly;
    constructor(host: Friendly, args: {});
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skart(err?: Error): void;
    getRunningPromise(): PromiseLike<void>;
}
export declare class Starting extends State {
    protected host: Friendly;
    private startingPromise;
    private onStoppings;
    private startingErrors;
    constructor(host: Friendly, args: {
        onStopping: OnStopping | null;
    });
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skart(err?: Error): never;
    getRunningPromise(): PromiseLike<void>;
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
    stop(runningError?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skart(err?: Error): never;
    getRunningPromise(): PromiseLike<void>;
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
    stop(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skart(err?: Error): never;
    getRunningPromise(): PromiseLike<void>;
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
    postActivate(): void;
    start(onStopping?: OnStopping): PromiseLike<void>;
    stop(): Promise<void>;
    getReadyState(): ReadyState;
    skart(err?: Error): void;
    getRunningPromise(): PromiseLike<void>;
}
