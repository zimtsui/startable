import { OnStopping } from '../../startable-like';
import { StateLike } from '../../state-like';


export interface StartingLike extends StateLike {
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
