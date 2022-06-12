import { Starting } from './state';
import { FactoryDeps } from './factory-deps';
import { FactoryLike } from './factory-like';
import { Args } from './args';
import { Startable } from '../../startable';



export class Factory implements FactoryLike {
	public constructor(
		private factories: FactoryDeps,
	) { }

	public create(
		host: Startable,
		args: Args,
	): Starting {
		return new Starting(
			args,
			host,
			this.factories,
		);
	}
}
