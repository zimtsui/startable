import { StateLike } from '../../state-like';
import { OnStopping } from '../../startable-like';


export namespace StartedLike {
	export interface FactoryLike {
		create(args: FactoryLike.Args): StateLike;
	}

	export namespace FactoryLike {
		export interface Args {
			startingPromise: Promise<void>;
			onStoppings: OnStopping[];
		}
	}
}

export class CannotSkipStartDuringStarted extends Error {
	public constructor() {
		super('Cannot call .skipStart() during STARTED.');
	}
}
