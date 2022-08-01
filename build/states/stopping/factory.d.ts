import { Args } from './args';
import { FactoryLike } from './factory-like';
import { Stopping } from './state';
import { FactoryDeps } from './factory-deps';
import { Startable } from '../../startable';
export declare class Factory<StartArgs extends unknown[]> implements FactoryLike<StartArgs> {
    private factories;
    constructor(factories: FactoryDeps<StartArgs>);
    create(host: Startable<StartArgs>, args: Args): Stopping<StartArgs>;
}
