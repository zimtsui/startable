import { State, CannotFail } from '../state';
import { FriendlyStartableLike, FactoryLike, StateLike } from '../friendly-startable-like';
import { OnStopping, ReadyState } from '../startable-like';
export declare class Started extends State implements StateLike.Started {
    protected readonly startable: FriendlyStartableLike;
    private readonly startingPromise;
    private onStoppings;
    constructor(startable: FriendlyStartableLike, args: Started.Args);
    getStartingPromise(): Promise<void>;
    tryStart(onStopping?: OnStopping): Promise<void>;
    start(onStopping?: OnStopping): Promise<void>;
    tryStop(err?: Error): Promise<void>;
    stop(err?: Error): Promise<void>;
    fail(err: Error): Promise<never>;
    getReadyState(): ReadyState;
}
export declare namespace Started {
    export import Args = FactoryLike.Started.Args;
    class Factory implements FactoryLike.Started {
        protected startable: FriendlyStartableLike;
        constructor(startable: FriendlyStartableLike);
        create(args: Args): Started;
    }
}
export declare class CannotFailDuringStarted extends CannotFail {
    constructor();
}
