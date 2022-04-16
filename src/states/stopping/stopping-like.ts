import { OnStopping } from '../../startable-like';
import { StateLike } from '../../state-like';


export namespace StoppingLike {
	export interface FactoryLike {
		create(args: FactoryLike.Args): StateLike;
	}

	export const FactoryLike = {};

	export namespace FactoryLike {
		export interface Args {
			startingPromise: Promise<void>;
			onStoppings: OnStopping[];
			err?: Error;
		}
	}
}
