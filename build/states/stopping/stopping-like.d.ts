import { OnStopping } from '../../startable-like';
import { StateLike } from '../../state-like';
export interface StoppingLike extends StateLike {
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
