import { Startable, State } from '../../startable';
import { OnStopping, ReadyState } from '../../startable-like';
import { FactoryDeps } from './factory-deps';
import { Args } from './args';
export declare class Started<StartArgs extends unknown[]> extends State<StartArgs> {
    protected host: Startable<StartArgs>;
    private factories;
    private startingPromise;
    private onStoppings;
    constructor(args: Args, host: Startable<StartArgs>, factories: FactoryDeps<StartArgs>);
    postActivate(): void;
    start(startArgs: StartArgs, onStopping?: OnStopping): Promise<void>;
    assart(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    starp(err?: Error): Promise<void>;
    getReadyState(): ReadyState;
    skipStart(onStopping?: OnStopping): never;
}
export declare class CannotSkipStartDuringStarted extends Error {
    constructor();
}
