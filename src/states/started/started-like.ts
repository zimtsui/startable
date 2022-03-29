import {
	StartableLike,
	OnStopping,
} from '../../startable-like';

export interface StartedLike extends StartableLike {
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
