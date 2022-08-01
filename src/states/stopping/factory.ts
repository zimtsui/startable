import { Args } from './args';
import { FactoryLike } from './factory-like';
import { Stopping } from './state';
import { FactoryDeps } from './factory-deps';
import { Startable } from '../../startable';


export class Factory<StartArgs extends unknown[]> implements FactoryLike<StartArgs> {
	public constructor(
		private factories: FactoryDeps<StartArgs>,
	) { }

	public create(
		host: Startable<StartArgs>,
		args: Args,
	): Stopping<StartArgs> {
		return new Stopping(
			args,
			host,
			this.factories,
		);
	}
}
