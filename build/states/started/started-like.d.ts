import { StateLike } from '../../state-like';
import { OnStopping } from '../../startable-like';
export declare namespace StartedLike {
    interface FactoryLike {
        create(args: FactoryLike.Args): StateLike;
    }
    const FactoryLike: {};
    namespace FactoryLike {
        interface Args {
            startingPromise: Promise<void>;
            onStoppings: OnStopping[];
        }
    }
}
