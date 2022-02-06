import { ReadyState } from './interfaces';
import { OnStopping } from './interfaces';
import { Startable } from './startable';
import { ManualPromise } from 'manual-promise';
export declare abstract class State {
    protected ctx: Startable;
    protected setState: (state: State) => void;
    abstract readyState: ReadyState;
    abstract start(onStopping?: OnStopping): Promise<void>;
    abstract stop(err?: Error): Promise<void>;
    constructor(ctx: Startable, setState: (state: State) => void);
}
export declare class Stopped extends State {
    protected ctx: Startable;
    protected setState: (state: State) => void;
    readyState: ReadyState;
    stoppingPromise: Promise<void>;
    rawStart: () => Promise<void>;
    rawStop: () => Promise<void>;
    constructor(ctx: Startable, setState: (state: State) => void, prevState: Stopped.PrevState, args: Stopped.Args);
    start(onStopping?: OnStopping): Promise<void>;
    stop(): Promise<void>;
}
export declare namespace Stopped {
    interface PrevState {
        rawStart(): Promise<void>;
        rawStop(): Promise<void>;
        stoppingPromise: Promise<void>;
    }
    interface Args {
    }
}
export declare class Unstopped extends Stopped {
    readyState: ReadyState;
}
export declare class Starting extends State {
    protected ctx: Startable;
    protected setState: (state: State) => void;
    readyState: ReadyState;
    startingPromise: ManualPromise;
    rawStart: () => Promise<void>;
    rawStop: () => Promise<void>;
    onStoppings: OnStopping[];
    startingIsFailedManually: boolean;
    constructor(ctx: Startable, setState: (state: State) => void, prevState: Starting.PrevState, args: Starting.Args);
    private setup;
    start(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
}
export declare namespace Starting {
    interface PrevState {
        rawStart(): Promise<void>;
        rawStop(): Promise<void>;
    }
    interface Args {
        onStopping?: OnStopping;
    }
}
export declare class Started extends State {
    protected ctx: Startable;
    protected setState: (state: State) => void;
    readyState: ReadyState;
    startingPromise: Promise<void>;
    rawStart: () => Promise<void>;
    rawStop: () => Promise<void>;
    onStoppings: OnStopping[];
    constructor(ctx: Startable, setState: (state: State) => void, prevState: Started.PrevState, args: Started.Args);
    start(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
}
export declare namespace Started {
    interface Args {
    }
    interface PrevState {
        rawStart(): Promise<void>;
        rawStop(): Promise<void>;
        startingPromise: Promise<void>;
        onStoppings: OnStopping[];
    }
}
export declare class Unstarted extends Started {
    readyState: ReadyState;
}
export declare class Stopping extends State {
    protected ctx: Startable;
    protected setState: (state: State) => void;
    readyState: ReadyState;
    startingPromise: Promise<void>;
    stoppingPromise: ManualPromise;
    rawStart: () => Promise<void>;
    rawStop: () => Promise<void>;
    onStoppings: OnStopping[];
    constructor(ctx: Startable, setState: (state: State) => void, prevState: Stopping.PrevState, args: Stopping.Args);
    private setup;
    start(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
}
export declare namespace Stopping {
    interface PrevState {
        rawStart(): Promise<void>;
        rawStop(): Promise<void>;
        startingPromise: Promise<void>;
        onStoppings: OnStopping[];
    }
    interface Args {
        err?: Error;
    }
}
declare const StoppedAlias: typeof Stopped;
declare const UnstoppedAlias: typeof Unstopped;
declare const StartingAlias: typeof Starting;
declare const StartedAlias: typeof Starting;
declare const UnstartedAlias: typeof Unstarted;
declare const StoppingAlias: typeof Stopping;
declare type StoppedAlias = Stopped;
declare type UnstoppedAlias = Unstopped;
declare type StartingAlias = Starting;
declare type StartedAlias = Starting;
declare type UnstartedAlias = Unstarted;
declare type StoppingAlias = Stopping;
export declare namespace State {
    const Stopped: typeof import("./states").Stopped;
    const Unstopped: typeof import("./states").Unstopped;
    const Starting: typeof import("./states").Starting;
    const Started: typeof import("./states").Starting;
    const Unstarted: typeof import("./states").Unstarted;
    const Stopping: typeof import("./states").Stopping;
    type Stopped = StoppedAlias;
    type Unstopped = UnstoppedAlias;
    type Starting = StartingAlias;
    type Started = StartedAlias;
    type Unstarted = UnstartedAlias;
    type Stopping = StoppingAlias;
}
export {};
