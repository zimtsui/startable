import { Starting } from './state';
import { FactoryDeps } from './factory-deps';
import { FactoryLike } from './factory-like';
import { Args } from './args';
import { Startable } from '../../startable';
export declare class Factory implements FactoryLike {
    private factories;
    constructor(factories: FactoryDeps);
    create(host: Startable, args: Args): Starting;
}
