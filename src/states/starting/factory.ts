import { instantInject } from '@zimtsui/injektor';
import { TYPES } from '../../injection/types';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { Starting } from './state';
import { FactoryDeps } from './factory-deps';
import { FactoryLike } from './factory-like';
import { Args } from './args';



export class Factory implements FactoryLike {
	@instantInject(TYPES.FriendlyStartable)
	private startable!: FriendlyStartableLike;
	@instantInject(TYPES.Factories)
	private factories!: FactoryDeps;

	public create(args: Args): Starting {
		return new Starting(
			args,
			this.startable,
			this.factories,
		);
	}
}
