import { Startable, State } from '../../startable';
import { OnStopping, ReadyState } from '../../startable-like';
import { FactoryDeps } from './factory-deps';
import { Args } from './args';
export declare class Stopped extends State {
    protected host: Startable;
    private factories;
    private stoppingPromise;
    constructor(args: Args, host: Startable, factories: FactoryDeps);
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<never>;
    stop(): Promise<void>;
    starp(err?: Error): Promise<never>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
}
export declare class CannotStarpDuringStopped extends Error {
    constructor();
}
export declare class CannotAssartDuringStopped extends Error {
    constructor();
}
