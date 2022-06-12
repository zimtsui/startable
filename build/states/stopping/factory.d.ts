import { Args } from './args';
import { FactoryLike } from './factory-like';
import { Stopping } from './state';
import { FactoryDeps } from './factory-deps';
import { Startable } from '../../startable';
export declare class Factory implements FactoryLike {
    private factories;
    constructor(factories: FactoryDeps);
    create(host: Startable, args: Args): Stopping;
}
