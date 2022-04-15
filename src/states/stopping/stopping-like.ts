import { OnStopping } from '../../startable-like';
import { StateLike } from '../../state-like';


export interface StoppingLike extends StateLike {
	getStartingPromise(): Promise<void>;
	getStoppingPromise(): Promise<void>;
}

export namespace StoppingLike {
	export interface FactoryLike {
		create(args: FactoryLike.Args): StoppingLike;
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
