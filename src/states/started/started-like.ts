import { StateLike } from '../../state-like';
import { OnStopping } from '../../startable-like';


export namespace StartedLike {
	export interface FactoryLike {
		create(args: FactoryLike.Args): StateLike;
	}

	export const FactoryLike = {};

	export namespace FactoryLike {
		export interface Args {
			startingPromise: Promise<void>;
			onStoppings: OnStopping[];
		}
	}
}
