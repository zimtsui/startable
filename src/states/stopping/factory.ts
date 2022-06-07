import { FriendlyStartableLike } from '../../friendly-startable-like';
import { Args } from './args';
import { FactoryLike } from './factory-like';
import { instantInject } from '@zimtsui/injektor';
import { TYPES } from '../../injection/types';
import { Stopping } from './state';
import { FactoryDeps } from './factory-deps';


export class Factory implements FactoryLike {
	@instantInject(TYPES.FriendlyStartable)
	private startable!: FriendlyStartableLike;
	@instantInject(TYPES.Factories)
	private factories!: FactoryDeps;

	public create(args: Args): Stopping {
		return new Stopping(
			args,
			this.startable,
			this.factories,
		);
	}
}
