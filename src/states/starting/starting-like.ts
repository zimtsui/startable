import { OnStopping } from '../../startable-like';
import { StateLike } from '../../state-like';


export namespace StartingLike {
	export interface FactoryLike {
		create(args: FactoryLike.Args): StateLike;
	}

	export const FactoryLike = {};

	export namespace FactoryLike {
		export interface Args {
			stoppingPromise: Promise<void>;
			onStopping?: OnStopping;
		}
	}
}
