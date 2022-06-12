import { FactoryLike } from './factory-like';
import { FactoryDeps } from './factory-deps';
import { Stopped } from './state';
import { Args } from './args';
import { Startable } from '../../startable';



export class Factory implements FactoryLike {
	public constructor(
		private factories: FactoryDeps,
	) { }

	public create(
		host: Startable,
		args: Args,
	): Stopped {
		return new Stopped(
			args,
			host,
			this.factories,
		);
	}
}
