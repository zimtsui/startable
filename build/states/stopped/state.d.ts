import { Startable, State } from '../../startable';
import { OnStopping, ReadyState } from '../../startable-like';
import { FactoryDeps } from './factory-deps';
import { Args } from './args';
export declare class Stopped<StartArgs extends unknown[]> extends State<StartArgs> {
    protected host: Startable<StartArgs>;
    private factories;
    private stoppingPromise;
    constructor(args: Args, host: Startable<StartArgs>, factories: FactoryDeps<StartArgs>);
    postActivate(): void;
    start(startArgs: StartArgs, onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<never>;
    stop(): Promise<void>;
    starp(err?: Error): Promise<never>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): void;
    getStarting(): Promise<void>;
    getStopping(): Promise<void>;
}
export declare class CannotStarpDuringStopped extends Error {
}
export declare class CannotAssartDuringStopped extends Error {
}
export declare class CannotGetStartingDuringStopped extends Error {
}
