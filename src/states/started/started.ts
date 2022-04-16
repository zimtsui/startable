import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { inject, Container } from 'injektor';
import { StartedLike, CannotSkipStartDuringStarted } from './started-like';

import { StoppingLike } from '../stopping/stopping-like';


export class Started implements StateLike {
	[STATE_LIKE_NOMINAL]: void;

	private startingPromise: Promise<void>;
	private onStoppings: OnStopping[];

	public constructor(
		args: StartedLike.FactoryLike.Args,
		private startable: FriendlyStartableLike<Started.FactoryDeps>,
	) {
		this.startingPromise = args.startingPromise;
		this.onStoppings = args.onStoppings;
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async assart(onStopping?: OnStopping): Promise<void> {
		await this.start(onStopping);
	}

	public async stop(err?: Error): Promise<void> {
		const nextState = this.startable.factories.stopping.create({
			startingPromise: this.startingPromise,
			onStoppings: this.onStoppings,
			err,
		});
		this.startable.setState(nextState);
		await this.startable.stop();
	}

	public async starp(err?: Error): Promise<void> {
		await this.stop(err);
	}

	public getReadyState(): ReadyState {
		return ReadyState.STARTED;
	}

	public skipStart(onStopping?: OnStopping): never {
		throw new CannotSkipStartDuringStarted();
	}
}

export namespace Started {
	export interface FactoryDeps {
		stopping: StoppingLike.FactoryLike;
	}

	export class Factory implements StartedLike.FactoryLike {
		private container = new Container();
		@inject(FriendlyStartableLike)
		private startable!: FriendlyStartableLike<Started.FactoryDeps>;

		public create(args: StartedLike.FactoryLike.Args): Started {
			return this.container.inject(
				new Started(
					args,
					this.startable,
				),
			);
		}
	}
}
