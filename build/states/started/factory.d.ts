import { FactoryLike } from './factory-like';
import { FactoryDeps } from './factory-deps';
import { Started } from './state';
import { Args } from './args';
import { Startable } from '../../startable';
export declare class Factory implements FactoryLike {
    private factories;
    constructor(factories: FactoryDeps);
    create(host: Startable, args: Args): Started;
}
