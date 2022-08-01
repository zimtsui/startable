import { Startable, State } from '../../startable';
import { OnStopping, ReadyState } from '../../startable-like';
import { FactoryDeps } from './factory-deps';
import { Args } from './args';
export declare class Starting<StartArgs extends unknown[]> extends State<StartArgs> {
    protected host: Startable<StartArgs>;
    private factories;
    private startingPromise;
    private stoppingPromise;
    private onStoppings;
    private manualFailure;
    private startArgs;
    constructor(args: Args<StartArgs>, host: Startable<StartArgs>, factories: FactoryDeps<StartArgs>);
    postActivate(): void;
    start(startArgs: StartArgs, onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
    getStarting(): Promise<void>;
    getStopping(): Promise<void>;
}
export declare class StarpCalledDuringStarting extends Error {
    constructor();
}
export declare class CannotSkipStartDuringStarting extends Error {
    constructor();
}
export declare class CannotStopDuringStarting extends Error {
}
