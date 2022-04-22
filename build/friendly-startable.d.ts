import { OnStopping, RawStart, RawStop, ReadyState } from './startable-like';
import { StateLike } from './state-like';
import { FriendlyStartableLike } from './friendly-startable-like';
import { Stopped } from './states/stopped/stopped';
import { Starting } from './states/starting/starting';
import { Started } from './states/started/started';
import { Stopping } from './states/stopping/stopping';
interface Factories extends Stopped.FactoryDeps, Starting.FactoryDeps, Started.FactoryDeps, Stopping.FactoryDeps {
}
export declare class FriendlyStartable implements FriendlyStartableLike<Factories> {
    rawStart: RawStart;
    rawStop: RawStop;
    private c;
    private state;
    factories: Factories;
    constructor(rawStart: RawStart, rawStop: RawStop);
    setState(state: StateLike): void;
    getState(): StateLike;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    starp(err?: Error): Promise<void>;
    stop(err?: Error): Promise<void>;
}
export {};
