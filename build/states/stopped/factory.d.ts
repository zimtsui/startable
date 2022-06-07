import { FactoryLike } from './factory-like';
import { Stopped } from './state';
import { Args } from './args';
export declare class Factory implements FactoryLike {
    private startable;
    private factories;
    create(args: Args): Stopped;
}
