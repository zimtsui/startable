import { FactoryLike } from './factory-like';
import { FactoryDeps } from './factory-deps';
import { Started } from './state';
import { Args } from './args';
import { Startable } from '../../startable';



export class Factory implements FactoryLike {
	public constructor(
		private factories: FactoryDeps,
	) { }

	public create(
		host: Startable,
		args: Args,
	): Started {
		return new Started(
			args,
			host,
			this.factories,
		);
	}
}
