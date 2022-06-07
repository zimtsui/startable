import { FriendlyStartableLike } from '../../friendly-startable-like';
import { instantInject } from '@zimtsui/injektor';
import { TYPES } from '../../injection/types';
import { FactoryLike } from './factory-like';
import { FactoryDeps } from './factory-deps';
import { Started } from './state';
import { Args } from './args';



export class Factory implements FactoryLike {
	@instantInject(TYPES.FriendlyStartable)
	private startable!: FriendlyStartableLike;
	@instantInject(TYPES.Factories)
	private factories!: FactoryDeps;

	public create(args: Args): Started {
		return new Started(
			args,
			this.startable,
			this.factories,
		);
	}
}
