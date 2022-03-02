import { State, CannotFail } from '../state';
import { FriendlyStartableLike, FactoryLike, StateLike } from '../friendly-startable-like';
import { OnStopping, ReadyState } from '../startable-like';
export declare class Stopped extends State implements StateLike.Stopped {
    protected readonly startable: FriendlyStartableLike;
    private readonly stoppingPromise;
    constructor(startable: FriendlyStartableLike, args: Stopped.Args);
    getStoppingPromise(): Promise<void>;
    tryStart(onStopping?: OnStopping): Promise<void>;
    start(onStopping?: OnStopping): Promise<void>;
    tryStop(err?: Error): Promise<void>;
    stop(): Promise<void>;
    fail(err: Error): Promise<never>;
    getReadyState(): ReadyState;
}
export declare namespace Stopped {
    export import Args = FactoryLike.Stopped.Args;
    class Factory implements FactoryLike.Stopped {
        protected startable: FriendlyStartableLike;
        constructor(startable: FriendlyStartableLike);
        create(args: Args): Stopped;
    }
}
export declare class CannotFailDuringStopped extends CannotFail {
    constructor();
}
