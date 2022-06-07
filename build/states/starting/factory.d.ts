import { Starting } from './state';
import { FactoryLike } from './factory-like';
import { Args } from './args';
export declare class Factory implements FactoryLike {
    private startable;
    private factories;
    create(args: Args): Starting;
}
