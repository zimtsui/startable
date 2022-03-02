import { StartableLike, OnStopping, RawStart, RawStop } from './startable-like';
export interface FriendlyStartableLike extends StartableLike {
    readonly rawStart: RawStart;
    readonly rawStop: RawStop;
    readonly factories: Factories;
    state: StateLike;
}
export interface StateLike extends StartableLike {
}
export declare namespace StateLike {
    interface Stopped extends StateLike {
        getStoppingPromise(): Promise<void>;
    }
    interface Starting extends StateLike {
        getStartingPromise(): Promise<void>;
    }
    interface Started extends StateLike {
        getStartingPromise(): Promise<void>;
    }
    interface Stopping extends StateLike {
        getStartingPromise(): Promise<void>;
        getStoppingPromise(): Promise<void>;
    }
}
export interface Factories {
    readonly stopped: FactoryLike.Stopped;
    readonly starting: FactoryLike.Starting;
    readonly started: FactoryLike.Started;
    readonly stopping: FactoryLike.Stopping;
}
export declare namespace FactoryLike {
    interface Stopped {
        create(args: Stopped.Args): StateLike.Stopped;
    }
    namespace Stopped {
        interface Args {
            readonly stoppingPromise: Promise<void>;
        }
    }
    interface Starting {
        create(args: Starting.Args): StateLike.Starting;
    }
    namespace Starting {
        interface Args {
            readonly onStopping?: OnStopping;
        }
    }
    interface Started {
        create(args: Started.Args): StateLike.Started;
    }
    namespace Started {
        interface Args {
            readonly startingPromise: Promise<void>;
            readonly onStoppings: OnStopping[];
        }
    }
    interface Stopping {
        create(args: Stopping.Args): StateLike.Stopping;
    }
    namespace Stopping {
        interface Args {
            readonly startingPromise: Promise<void>;
            readonly onStoppings: OnStopping[];
            readonly err?: Error;
        }
    }
}
