import { Starting } from './state';
import { FactoryDeps } from './factory-deps';
import { FactoryLike } from './factory-like';
import { Args } from './args';
import { Startable } from '../../startable';
export declare class Factory<StartArgs extends unknown[]> implements FactoryLike<StartArgs> {
    private factories;
    constructor(factories: FactoryDeps<StartArgs>);
    create(host: Startable<StartArgs>, args: Args<StartArgs>): Starting<StartArgs>;
}
