import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import { PublicManualPromise } from '../../public-manual-promise';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import {
	StoppingLike,
	CannotAssartDuringStopping,
	CannotSkipStartDuringStopping,
} from './stopping-like';
import { instantInject, Container } from 'injektor';

import { StoppedLike } from '../stopped/stopped-like';


export class Stopping implements StateLike {
	[STATE_LIKE_NOMINAL]: void;

	private startingPromise: Promise<void>;
	private stoppingPromise = PublicManualPromise.create();
	private onStoppings: OnStopping[];

	public constructor(
		args: StoppingLike.FactoryLike.Args,
		private startable: FriendlyStartableLike<Stopping.FactoryDeps>,
	) {
		this.startingPromise = args.startingPromise;
		this.onStoppings = args.onStoppings;

		for (const onStopping of this.onStoppings) onStopping(args.err);

		this.setup();
	}

	private async setup(): Promise<void> {
		try {
			await this.startable.rawStop();
			this.stoppingPromise.resolve();
		} catch (err) {
			this.stoppingPromise.reject(<Error>err);
		}
		const nextState = this.startable.factories.stopped.create({
			stoppingPromise: this.stoppingPromise,
		});
		this.startable.setState(nextState);
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.startingPromise;
	}

	public async assart(onStopping?: OnStopping): Promise<never> {
		throw new CannotAssartDuringStopping();
	}

	public async stop(err?: Error): Promise<void> {
		await this.stoppingPromise;
	}

	public async starp(err?: Error): Promise<void> {
		await this.stop(err);
	}

	public getReadyState(): ReadyState {
		return ReadyState.STOPPING;
	}

	public skipStart(onStopping?: OnStopping): never {
		throw new CannotSkipStartDuringStopping();
	}
}

export namespace Stopping {
	export interface FactoryDeps {
		stopped: StoppedLike.FactoryLike;
	}

	export class Factory implements StoppingLike.FactoryLike {
		private container = new Container();
		@instantInject(FriendlyStartableLike)
		private startable!: FriendlyStartableLike<Stopping.FactoryDeps>;

		public create(args: StoppingLike.FactoryLike.Args): Stopping {
			return new Stopping(
				args,
				this.startable,
			);
		}
	}
}
