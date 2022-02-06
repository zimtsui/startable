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
export declare namespace State {
    class Stopped extends State {
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
    namespace Stopped {
        interface PrevState {
            rawStart(): Promise<void>;
            rawStop(): Promise<void>;
            stoppingPromise: Promise<void>;
        }
        interface Args {
        }
    }
    class Unstopped extends Stopped {
        readyState: ReadyState;
    }
    class Starting extends State {
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
    namespace Starting {
        interface PrevState {
            rawStart(): Promise<void>;
            rawStop(): Promise<void>;
        }
        interface Args {
            onStopping?: OnStopping;
        }
    }
    class Started extends State {
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
    namespace Started {
        interface Args {
        }
        interface PrevState {
            rawStart(): Promise<void>;
            rawStop(): Promise<void>;
            startingPromise: Promise<void>;
            onStoppings: OnStopping[];
        }
    }
    class Unstarted extends Started {
        readyState: ReadyState;
    }
    class Stopping extends State {
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
    namespace Stopping {
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
}
