import { StateLike } from '../../state-like';
export declare namespace StoppedLike {
    interface FactoryLike {
        create(args: FactoryLike.Args): StateLike;
    }
    namespace FactoryLike {
        interface Args {
            stoppingPromise: Promise<void>;
        }
    }
}
export declare class CannotStarpDuringStopped extends Error {
    constructor();
}
export declare class CannotAssartDuringStopped extends Error {
    constructor();
}
