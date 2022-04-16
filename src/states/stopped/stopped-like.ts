import { StateLike } from '../../state-like';


export namespace StoppedLike {
	export interface FactoryLike {
		create(args: FactoryLike.Args): StateLike;
	}

	export const FactoryLike = {};

	export namespace FactoryLike {
		export interface Args {
			stoppingPromise: Promise<void>;
		}
	}
}

export class CannotStopDuringStopped extends Error {
	public constructor() {
		super('Cannot call .stop() during STOPPED.');
	}
}
