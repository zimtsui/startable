import { StartableLike, OnStopping } from '../../startable-like';
export interface StoppingLike extends StartableLike {
    getStartingPromise(): Promise<void>;
    getStoppingPromise(): Promise<void>;
}
export declare namespace StoppingLike {
    interface FactoryLike {
        create(args: FactoryLike.Args): StoppingLike;
    }
    const FactoryLike: {};
    namespace FactoryLike {
        interface Args {
            startingPromise: Promise<void>;
            onStoppings: OnStopping[];
            err?: Error;
        }
    }
}
