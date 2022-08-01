import { Starting } from './state';
import { FactoryDeps } from './factory-deps';
import { FactoryLike } from './factory-like';
import { Args } from './args';
import { Startable } from '../../startable';



export class Factory<StartArgs extends unknown[]> implements FactoryLike<StartArgs> {
	public constructor(
		private factories: FactoryDeps<StartArgs>,
	) { }

	public create(
		host: Startable<StartArgs>,
		args: Args<StartArgs>,
	): Starting<StartArgs> {
		return new Starting(
			args,
			host,
			this.factories,
		);
	}
}
