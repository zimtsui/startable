import { Args } from './args';
import { FactoryLike } from './factory-like';
import { Stopping } from './state';
export declare class Factory implements FactoryLike {
    private startable;
    private factories;
    create(args: Args): Stopping;
}
