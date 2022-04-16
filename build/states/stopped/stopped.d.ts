import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import { StoppedLike } from './stopped-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { StartingLike } from '../starting/starting-like';
import { StartedLike } from '../started/started-like';
export declare class Stopped implements StateLike {
    private startable;
    [STATE_LIKE_NOMINAL]: void;
    private stoppingPromise;
    constructor(args: StoppedLike.FactoryLike.Args, startable: FriendlyStartableLike<Stopped.FactoryDeps>);
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<never>;
    stop(): Promise<void>;
    starp(err?: Error): Promise<never>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
}
export declare namespace Stopped {
    interface FactoryDeps {
        starting: StartingLike.FactoryLike;
        started: StartedLike.FactoryLike;
    }
    class Factory implements StoppedLike.FactoryLike {
        private container;
        private startable;
        create(args: StoppedLike.FactoryLike.Args): Stopped;
    }
}
