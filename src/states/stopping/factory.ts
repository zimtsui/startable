import { Args } from './args';
import { FactoryLike } from './factory-like';
import { Stopping } from './state';
import { FactoryDeps } from './factory-deps';
import { Startable } from '../../startable';


export class Factory implements FactoryLike {
	public constructor(
		private factories: FactoryDeps,
	) { }

	public create(
		host: Startable,
		args: Args,
	): Stopping {
		return new Stopping(
			args,
			host,
			this.factories,
		);
	}
}
