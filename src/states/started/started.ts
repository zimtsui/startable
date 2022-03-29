import {
	FriendlyStartable,
} from '../../friendly-startable';
import {
	OnStopping,
	ReadyState,
	CannotFail,
	CannotSkipStart,
} from '../../startable-like';
import { StartedLike } from './started-like';
import { inject, Container } from 'injektor';

import { StoppingLike } from '../stopping/stopping-like';

export class Started implements StartedLike {
	private startingPromise: Promise<void>;
	private onStoppings: OnStopping[];

	@inject(StoppingLike.FactoryLike)
	private stoppingFactory!: StoppingLike.FactoryLike;

	public constructor(
		args: Started.Args,
		private startable: FriendlyStartable,
	) {
		this.startingPromise = args.startingPromise;
		this.onStoppings = args.onStoppings;
	}

	public getStartingPromise(): Promise<void> {
		return this.startingPromise;
	}

	public async tryStart(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.tryStart(onStopping);
	}

	public async tryStop(err?: Error): Promise<void> {
		const nextState: StoppingLike =
			this.stoppingFactory.create({
				startingPromise: this.startingPromise,
				onStoppings: this.onStoppings,
				err,
			});
		this.startable.setState(nextState);
		await nextState.getStoppingPromise();
	}

	public async stop(err?: Error): Promise<void> {
		await this.tryStop(err);
	}

	public async fail(err: Error): Promise<never> {
		throw new CannotFailDuringStarted();
	}

	public getReadyState(): ReadyState {
		return ReadyState.STARTED;
	}

	public skipStart(onStopping?: OnStopping): never {
		throw new CannotSkipStartDuringStarted();
	}
}

export namespace Started {
	export import Args = StartedLike.FactoryLike.Args;

	export class Factory implements StartedLike.FactoryLike {
		private container = new Container();
		@inject(StoppingLike.FactoryLike)
		private stoppingFactory!: StoppingLike.FactoryLike;
		@inject(FriendlyStartable)
		private startable!: FriendlyStartable;

		public constructor() {
			this.container.register(
				StoppingLike.FactoryLike,
				() => this.stoppingFactory,
			);
			this.container.register(
				FriendlyStartable,
				() => this.startable,
			);
		}

		public create(args: Args): Started {
			return this.container.inject(
				new Started(
					args,
					this.startable,
				),
			);
		}
	}
}

export class CannotFailDuringStarted extends CannotFail {
	constructor() {
		super('Cannot call .fail() during STARTED.');
	}
}

export class CannotSkipStartDuringStarted extends CannotSkipStart {
	constructor() {
		super('Cannot call .skipStart() during STARTED.');
	}
}
