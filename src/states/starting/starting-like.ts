import {
	StartableLike,
	OnStopping,
} from '../../startable-like';

export interface StartingLike extends StartableLike {
	getStartingPromise(): Promise<void>;
}

export namespace StartingLike {
	export interface FactoryLike {
		create(args: FactoryLike.Args): StartingLike;
	}

	export const FactoryLike = {};

	export namespace FactoryLike {
		export interface Args {
			onStopping?: OnStopping;
		}
	}
}
