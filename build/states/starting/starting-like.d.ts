import { OnStopping } from '../../startable-like';
import { StateLike } from '../../state-like';
export declare namespace StartingLike {
    interface FactoryLike {
        create(args: FactoryLike.Args): StateLike;
    }
    const FactoryLike: {};
    namespace FactoryLike {
        interface Args {
            stoppingPromise: Promise<void>;
            onStopping?: OnStopping;
        }
    }
}
