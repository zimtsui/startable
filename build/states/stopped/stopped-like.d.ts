import { StateLike } from '../../state-like';
export declare namespace StoppedLike {
    interface FactoryLike {
        create(args: FactoryLike.Args): StateLike;
    }
    const FactoryLike: {};
    namespace FactoryLike {
        interface Args {
            stoppingPromise: Promise<void>;
        }
    }
}
export declare class CannotStopDuringStopped extends Error {
    constructor();
}
