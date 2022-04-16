import { OnStopping } from '../../startable-like';
import { StateLike } from '../../state-like';


export namespace StoppingLike {
	export interface FactoryLike {
		create(args: FactoryLike.Args): StateLike;
	}

	export namespace FactoryLike {
		export interface Args {
			startingPromise: Promise<void>;
			onStoppings: OnStopping[];
			err?: Error;
		}
	}
}

export class CannotSkipStartDuringStopping extends Error {
	public constructor() {
		super('Cannot call .skipStart() during STOPPING.');
	}
}

export class CannotAssartDuringStopping extends Error {
	public constructor() {
		super('Cannot call .assart() during STOPPING.');
	}
}
