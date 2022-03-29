import { StartableLike } from '../../startable-like';

export interface StoppedLike extends StartableLike {
	getStoppingPromise(): Promise<void>;
}

export namespace StoppedLike {
	export interface FactoryLike {
		create(args: FactoryLike.Args): StoppedLike;
	}

	export const FactoryLike = {};

	export namespace FactoryLike {
		export interface Args {
			stoppingPromise: Promise<void>;
		}
	}
}
