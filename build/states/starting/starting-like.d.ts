import { OnStopping } from '../../startable-like';
import { StateLike } from '../../state-like';
export declare namespace StartingLike {
    interface FactoryLike {
        create(args: FactoryLike.Args): StateLike;
    }
    namespace FactoryLike {
        interface Args {
            stoppingPromise: Promise<void>;
            onStopping?: OnStopping;
        }
    }
}
export declare class CannotSkipStartDuringStarting extends Error {
    constructor();
}
