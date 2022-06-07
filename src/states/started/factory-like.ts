import { StateLike } from '../../state-like';
import { Args } from './args';


export interface FactoryLike {
	create(args: Args): StateLike;
}
