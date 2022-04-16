import { StateLike } from '../../state-like';
import { OnStopping } from '../../startable-like';
export declare namespace StartedLike {
    interface FactoryLike {
        create(args: FactoryLike.Args): StateLike;
    }
    namespace FactoryLike {
        interface Args {
            startingPromise: Promise<void>;
            onStoppings: OnStopping[];
        }
    }
}
export declare class CannotSkipStartDuringStarted extends Error {
    constructor();
}
