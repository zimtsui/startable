import { StateLike } from '../../state-like';


export interface StoppedLike extends StateLike {
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
