import { Startable, State } from '../../startable';
import { OnStopping, ReadyState } from '../../startable-like';
import { FactoryDeps } from './factory-deps';
import { Args } from './args';
export declare class Starting extends State {
    protected host: Startable;
    private factories;
    private startingPromise;
    private stoppingPromise;
    private onStoppings;
    private manualFailure;
    constructor(args: Args, host: Startable, factories: FactoryDeps);
    postActivate(): void;
    start(onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
}
export declare class StarpCalledDuringStarting extends Error {
    constructor();
}
export declare class CannotSkipStartDuringStarting extends Error {
    constructor();
}
