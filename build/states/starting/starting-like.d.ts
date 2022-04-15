import { OnStopping } from '../../startable-like';
import { StateLike } from '../../state-like';
export interface StartingLike extends StateLike {
    getStartingPromise(): Promise<void>;
}
export declare namespace StartingLike {
    interface FactoryLike {
        create(args: FactoryLike.Args): StartingLike;
    }
    const FactoryLike: {};
    namespace FactoryLike {
        interface Args {
            onStopping?: OnStopping;
        }
    }
}
