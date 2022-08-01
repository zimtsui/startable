import { State, Startable } from '../../startable';
import { Args } from './args';
export interface FactoryLike<StartArgs extends unknown[]> {
    create(host: Startable<StartArgs>, args: Args<StartArgs>): State<StartArgs>;
}
