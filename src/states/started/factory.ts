import { FactoryLike } from './factory-like';
import { FactoryDeps } from './factory-deps';
import { Started } from './state';
import { Args } from './args';
import { Startable } from '../../startable';



export class Factory<StartArgs extends unknown[]> implements FactoryLike<StartArgs> {
	public constructor(
		private factories: FactoryDeps<StartArgs>,
	) { }

	public create(
		host: Startable<StartArgs>,
		args: Args,
	): Started<StartArgs> {
		return new Started(
			args,
			host,
			this.factories,
		);
	}
}
