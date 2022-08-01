import { FactoryLike } from './factory-like';
import { FactoryDeps } from './factory-deps';
import { Stopped } from './state';
import { Args } from './args';
import { Startable } from '../../startable';
export declare class Factory<StartArgs extends unknown[]> implements FactoryLike<StartArgs> {
    private factories;
    constructor(factories: FactoryDeps<StartArgs>);
    create(host: Startable<StartArgs>, args: Args): Stopped<StartArgs>;
}
