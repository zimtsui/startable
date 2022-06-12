import { State, Startable } from '../../startable';
import { Args } from './args';
export interface FactoryLike {
    create(host: Startable, args: Args): State;
}
