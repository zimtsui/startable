import { StateLike } from '../../state-like';
export interface StoppedLike extends StateLike {
    getStoppingPromise(): Promise<void>;
}
export declare namespace StoppedLike {
    interface FactoryLike {
        create(args: FactoryLike.Args): StoppedLike;
    }
    const FactoryLike: {};
    namespace FactoryLike {
        interface Args {
            stoppingPromise: Promise<void>;
        }
    }
}
