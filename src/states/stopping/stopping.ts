import {
	OnStopping,
	ReadyState,
} from '../../startable-like';
import { PublicManualPromise } from '../../public-manual-promise';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { StoppingLike } from './stopping-like';
import { inject, Container } from 'injektor';

import { StoppedLike } from '../stopped/stopped-like';


export class Stopping implements StoppingLike {
	private startingPromise: Promise<void>;
	private stoppingPromise = PublicManualPromise.create();
	private onStoppings: OnStopping[];
	private manualFailure: null | Error = null;

	public static FactoryDeps = {};
	@inject(Stopping.FactoryDeps)
	private factories!: Stopping.FactoryDeps;

	public constructor(
		args: Stopping.Args,
		private startable: FriendlyStartableLike,
	) {
		this.startingPromise = args.startingPromise;
		this.onStoppings = args.onStoppings;

		for (const onStopping of this.onStoppings) onStopping(args.err);

		this.setup();
	}

	public getStartingPromise(): Promise<void> {
		return this.startingPromise;
	}

	public getStoppingPromise(): Promise<void> {
		return this.stoppingPromise;
	}

	private async setup(): Promise<void> {
		try {
			await this.startable.rawStop();
			if (this.manualFailure) throw this.manualFailure;
			this.stoppingPromise.resolve();
		} catch (err) {
			this.stoppingPromise.reject(<Error>err);
		}
		const nextState = this.factories.stopped.create({
			stoppingPromise: this.stoppingPromise,
		});
		this.startable.setState(nextState);
	}

	public async tryStart(onStopping?: OnStopping): Promise<never> {
		throw new CannotTryStartDuringStopping();
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.startingPromise;
	}

	public async tryStop(err?: Error): Promise<void> {
		await this.stoppingPromise;
	}

	public async stop(err?: Error): Promise<void> {
		await this.tryStop(err);
	}

	public async fail(err: Error): Promise<void> {
		this.manualFailure = err;
		await this.stoppingPromise.catch(() => { });
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

	export import Args = StoppingLike.FactoryLike.Args;

	export class Factory implements StoppingLike.FactoryLike {
		private container = new Container();
		@inject(Stopping.FactoryDeps)
		private factories!: Stopping.FactoryDeps;
		@inject(FriendlyStartableLike)
		private startable!: FriendlyStartableLike;

		public constructor() {
			this.container.register(
				FriendlyStartableLike,
				() => this.startable,
			);
			this.container.register(
				Stopping.FactoryDeps,
				() => this.factories,
			);
		}

		public create(args: Args): Stopping {
			return this.container.inject(
				new Stopping(
					args,
					this.startable,
				),
			);
		}
	}
}

export class CannotTryStartDuringStopping extends Error {
	constructor() {
		super('Cannot call .tryStop() during STOPPING.');
	}
}

export class CannotSkipStartDuringStopping extends Error {
	constructor() {
		super('Cannot call .skipStart() during STOPPING.');
	}
}
