import { OnStopping } from '../../startable-like';
import { StateLike } from '../../state-like';
export declare namespace StoppingLike {
    interface FactoryLike {
        create(args: FactoryLike.Args): StateLike;
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
