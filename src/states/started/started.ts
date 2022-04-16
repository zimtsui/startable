import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_TYPE } from '../../state-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { inject, Container } from 'injektor';

import { StartedLike } from './started-like';
import { StoppingLike } from '../stopping/stopping-like';


export class Started implements StateLike {
	[STATE_LIKE_TYPE]: void;

	private startingPromise: Promise<void>;
	private onStoppings: OnStopping[];

	public static FactoryDeps = {};
	@inject(Started.FactoryDeps)
	private factories!: Started.FactoryDeps;

	public constructor(
		args: StartedLike.FactoryLike.Args,
		private startable: FriendlyStartableLike,
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
		const nextState = this.factories.stopping.create({
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
		@inject(Started.FactoryDeps)
		private factories!: Started.FactoryDeps;
		@inject(FriendlyStartableLike)
		private startable!: FriendlyStartableLike;

		public constructor() {
			this.container.register(
				Started.FactoryDeps,
				() => this.factories,
			);
			this.container.register(
				FriendlyStartableLike,
				() => this.startable,
			);
		}

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

export class CannotSkipStartDuringStarted extends Error {
	public constructor() {
		super('Cannot call .skipStart() during STARTED.');
	}
}
