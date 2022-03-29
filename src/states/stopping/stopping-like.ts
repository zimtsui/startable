import {
	StartableLike,
	OnStopping,
} from '../../startable-like';

export interface StoppingLike extends StartableLike {
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
