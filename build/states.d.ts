import { ReadyState, OnStopping } from './startable-like';
import { ManualPromise } from '@zimtsui/manual-promise';
import { AgentLike, State } from './state';
export declare class Ready extends State {
    protected agent: AgentLike;
    constructor(agent: AgentLike, options: {});
    activate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skart(err?: Error): void;
    getRunning(): Promise<void>;
}
export declare class Starting extends State {
    protected agent: AgentLike;
    private starting;
    private onStoppings;
    private startingError;
    constructor(agent: AgentLike, options: {
        onStopping: OnStopping | null;
    });
    activate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skart(err?: Error): never;
    getRunning(): Promise<void>;
}
export declare class Started extends State {
    protected agent: AgentLike;
    private running;
    private starting;
    private onStoppings;
    private startingError;
    constructor(agent: AgentLike, args: {
        starting: ManualPromise<void>;
        onStoppings: OnStopping[];
        startingError: Error | null;
    });
    activate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    stop(runningError?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skart(err?: Error): never;
    getRunning(): Promise<void>;
}
export declare class Stopping extends State {
    protected agent: AgentLike;
    private starting;
    private running;
    private stopping;
    private onStoppings;
    private runningError;
    private stoppingError;
    constructor(agent: AgentLike, args: {
        starting: Promise<void>;
        running: Promise<void>;
        onStoppings: OnStopping[];
        runningError: Error | null;
    });
    activate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skart(err?: Error): never;
    getRunning(): Promise<void>;
}
export declare class Stopped extends State {
    protected agent: AgentLike;
    private starting;
    private running;
    private stopping;
    private stoppingError;
    constructor(agent: AgentLike, args: {
        starting: Promise<void> | null;
        running: Promise<void> | null;
        stopping: ManualPromise<void>;
        stoppingError: Error | null;
    });
    activate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    stop(): Promise<void>;
    getReadyState(): ReadyState;
    skart(err?: Error): void;
    getRunning(): Promise<void>;
}
