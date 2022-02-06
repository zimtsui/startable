import { ReadyState } from './interfaces';
import { OnStopping } from './interfaces';
import { Startable } from './startable';
import { ManualPromise } from 'manual-promise';
export declare abstract class State {
    protected readonly ctx: Startable;
    protected readonly setState: (state: State) => void;
    abstract readonly readyState: ReadyState;
    abstract start(onStopping?: OnStopping): Promise<void>;
    abstract stop(err?: Error): Promise<void>;
    constructor(ctx: Startable, setState: (state: State) => void);
}
export declare namespace State {
    class Stopped extends State {
        protected readonly ctx: Startable;
        protected readonly setState: (state: State) => void;
        readonly readyState: ReadyState;
        readonly stoppingPromise: Promise<void>;
        readonly rawStart: () => Promise<void>;
        readonly rawStop: () => Promise<void>;
        constructor(ctx: Startable, setState: (state: State) => void, prevState: Stopped.PrevState, args: Stopped.Args);
        start(onStopping?: OnStopping): Promise<void>;
        stop(): Promise<void>;
    }
    namespace Stopped {
        interface PrevState {
            readonly rawStart: () => Promise<void>;
            readonly rawStop: () => Promise<void>;
            readonly stoppingPromise: Promise<void>;
        }
        interface Args {
        }
    }
    class Unstopped extends Stopped {
        readonly readyState: ReadyState;
    }
    class Starting extends State {
        protected readonly ctx: Startable;
        protected readonly setState: (state: State) => void;
        readonly readyState: ReadyState;
        readonly startingPromise: ManualPromise;
        readonly rawStart: () => Promise<void>;
        readonly rawStop: () => Promise<void>;
        onStoppings: OnStopping[];
        startingIsFailedManually: boolean;
        constructor(ctx: Startable, setState: (state: State) => void, prevState: Starting.PrevState, args: Starting.Args);
        private setup;
        start(onStopping?: OnStopping): Promise<void>;
        stop(err?: Error): Promise<void>;
    }
    namespace Starting {
        interface PrevState {
            readonly rawStart: () => Promise<void>;
            readonly rawStop: () => Promise<void>;
        }
        interface Args {
            readonly onStopping?: OnStopping;
        }
    }
    class Started extends State {
        protected readonly ctx: Startable;
        protected readonly setState: (state: State) => void;
        readonly readyState: ReadyState;
        readonly startingPromise: Promise<void>;
        readonly rawStart: () => Promise<void>;
        readonly rawStop: () => Promise<void>;
        onStoppings: OnStopping[];
        constructor(ctx: Startable, setState: (state: State) => void, prevState: Started.PrevState, args: Started.Args);
        start(onStopping?: OnStopping): Promise<void>;
        stop(err?: Error): Promise<void>;
    }
    namespace Started {
        interface PrevState {
            readonly rawStart: () => Promise<void>;
            readonly rawStop: () => Promise<void>;
            readonly startingPromise: Promise<void>;
            readonly onStoppings: OnStopping[];
        }
        interface Args {
        }
    }
    class Unstarted extends Started {
        readonly readyState: ReadyState;
    }
    class Stopping extends State {
        protected readonly ctx: Startable;
        protected readonly setState: (state: State) => void;
        readonly readyState: ReadyState;
        readonly startingPromise: Promise<void>;
        readonly stoppingPromise: ManualPromise;
        readonly rawStart: () => Promise<void>;
        readonly rawStop: () => Promise<void>;
        onStoppings: OnStopping[];
        constructor(ctx: Startable, setState: (state: State) => void, prevState: Stopping.PrevState, args: Stopping.Args);
        private setup;
        start(onStopping?: OnStopping): Promise<void>;
        stop(err?: Error): Promise<void>;
    }
    namespace Stopping {
        interface PrevState {
            readonly rawStart: () => Promise<void>;
            readonly rawStop: () => Promise<void>;
            readonly startingPromise: Promise<void>;
            readonly onStoppings: OnStopping[];
        }
        interface Args {
            readonly err?: Error;
        }
    }
}
