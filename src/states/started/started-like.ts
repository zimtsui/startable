import { StateLike } from '../../state-like';
import { OnStopping } from '../../startable-like';


export interface StartedLike extends StateLike {
	getStartingPromise(): Promise<void>;
}

export namespace StartedLike {
	export interface FactoryLike {
		create(args: FactoryLike.Args): StartedLike;
	}

	export const FactoryLike = {};

	export namespace FactoryLike {
		export interface Args {
			startingPromise: Promise<void>;
			onStoppings: OnStopping[];
		}
	}
}
