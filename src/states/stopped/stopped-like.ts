import { StateLike } from '../../state-like';


export namespace StoppedLike {
	export interface FactoryLike {
		create(args: FactoryLike.Args): StateLike;
	}

	export namespace FactoryLike {
		export interface Args {
			stoppingPromise: Promise<void>;
		}
	}
}

export class CannotStarpDuringStopped extends Error {
	public constructor() {
		super('Cannot call .starp() during STOPPED.');
	}
}

export class CannotAssartDuringStopped extends Error {
	public constructor() {
		super('Cannot call .assart() during STOPPED.');
	}
}
