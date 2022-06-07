import { FactoryLike } from './factory-like';
import { FactoryDeps } from './factory-deps';
import { Stopped } from './state';
import { instantInject } from '@zimtsui/injektor';
import { TYPES } from '../../injection/types';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { Args } from './args';



export class Factory implements FactoryLike {
	@instantInject(TYPES.FriendlyStartable)
	private startable!: FriendlyStartableLike;
	@instantInject(TYPES.Factories)
	private factories!: FactoryDeps;

	public create(args: Args): Stopped {
		return new Stopped(
			args,
			this.startable,
			this.factories,
		);
	}
}
