import { StateLike } from '../../state-like';
import { OnStopping } from '../../startable-like';
export interface StartedLike extends StateLike {
    getStartingPromise(): Promise<void>;
}
export declare namespace StartedLike {
    interface FactoryLike {
        create(args: FactoryLike.Args): StartedLike;
    }
    const FactoryLike: {};
    namespace FactoryLike {
        interface Args {
            startingPromise: Promise<void>;
            onStoppings: OnStopping[];
        }
    }
}
