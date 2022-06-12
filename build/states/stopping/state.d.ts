import { OnStopping, ReadyState, Startable, State } from '../../startable';
import { Args } from './args';
import { FactoryDeps } from './factory-deps';
export declare class Stopping extends State {
    private args;
    protected host: Startable;
    private factories;
    private startingPromise;
    private stoppingPromise;
    private onStoppings;
    constructor(args: Args, host: Startable, factories: FactoryDeps);
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<never>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
}
export declare class CannotSkipStartDuringStopping extends Error {
    constructor();
}
export declare class CannotAssartDuringStopping extends Error {
    constructor();
}
