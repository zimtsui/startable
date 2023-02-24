import { ReadyState, OnStopping } from './startable-like';
import { ManualPromise } from '@zimtsui/coroutine-locks';
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
    private rawStarting;
    constructor(agent: AgentLike, options: {
        starting: ManualPromise<void>;
        onStoppings: OnStopping[];
        rawStarting: Promise<void>;
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
    constructor(agent: AgentLike, options: {
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
    private rawStopping;
    constructor(agent: AgentLike, options: {
        starting: Promise<void> | null;
        running: Promise<void> | null;
        stopping: ManualPromise<void>;
        rawStopping: Promise<void>;
    });
    activate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    stop(): Promise<void>;
    getReadyState(): ReadyState;
    skart(err?: Error): void;
    getRunning(): Promise<void>;
}
