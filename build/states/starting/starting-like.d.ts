import { StartableLike, OnStopping } from '../../startable-like';
export interface StartingLike extends StartableLike {
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
