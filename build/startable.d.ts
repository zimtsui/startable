import { EventEmitter } from 'events';
import { StartableLike, OnStopping, ReadyState } from './interfaces';
export declare abstract class Startable extends EventEmitter implements StartableLike {
    protected abstract Startable$rawStart(): Promise<void>;
    protected abstract Startable$rawStop(): Promise<void>;
    private Startble$state;
    start(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
}
