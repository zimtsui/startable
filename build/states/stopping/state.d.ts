import { Startable, State } from '../../startable';
import { OnStopping, ReadyState } from '../../startable-like';
import { Args } from './args';
import { FactoryDeps } from './factory-deps';
export declare class Stopping<StartArgs extends unknown[]> extends State<StartArgs> {
    private args;
    protected host: Startable<StartArgs>;
    private factories;
    private startingPromise;
    private stoppingPromise;
    private onStoppings;
    constructor(args: Args, host: Startable<StartArgs>, factories: FactoryDeps<StartArgs>);
    postActivate(): void;
    start(startArgs: StartArgs, onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<never>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
    getStarting(): Promise<void>;
    getStopping(): Promise<void>;
}
export declare class CannotSkipStartDuringStopping extends Error {
    constructor();
}
export declare class CannotAssartDuringStopping extends Error {
    constructor();
}
