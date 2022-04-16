import { OnStopping } from '../../startable-like';
import { StateLike } from '../../state-like';
export declare namespace StoppingLike {
    interface FactoryLike {
        create(args: FactoryLike.Args): StateLike;
    }
    namespace FactoryLike {
        interface Args {
            startingPromise: Promise<void>;
            onStoppings: OnStopping[];
            err?: Error;
        }
    }
}
export declare class CannotSkipStartDuringStopping extends Error {
    constructor();
}
export declare class CannotAssartDuringStopping extends Error {
    constructor();
}
