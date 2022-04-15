import {
	OnStopping,
	ReadyState,
} from '../../startable-like';
import { StoppedLike } from './stopped-like';
import { inject, Container } from 'injektor';
import { FriendlyStartableLike } from '../../friendly-startable-like';

import { StartingLike } from '../starting/starting-like';
import { StartedLike } from '../started/started-like';


export class Stopped implements StoppedLike {
	private stoppingPromise: Promise<void>;

	public static FactoryDeps = {};
	@inject(Stopped.FactoryDeps)
	private factories!: Stopped.FactoryDeps;

	public constructor(
		args: StoppedLike.FactoryLike.Args,
		private startable: FriendlyStartableLike,
	) {
		this.stoppingPromise = args.stoppingPromise;
	}

	public getStoppingPromise(): Promise<void> {
		return this.stoppingPromise;
	}

	public async tryStart(onStopping?: OnStopping): Promise<void> {
		const nextState = this.factories.starting.create({
			onStopping,
		});
		this.startable.setState(nextState);
		await nextState.getStartingPromise();
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.tryStart(onStopping);
	}

	public async tryStop(err?: Error): Promise<void> {
		await this.stoppingPromise;
	}

	public async stop(): Promise<void> {
		await this.tryStop();
	}

	public async fail(err: Error): Promise<never> {
		throw new CannotFailDuringStopped();
	}

	public getReadyState(): ReadyState {
		return ReadyState.STOPPED;
	}

	public skipStart(onStopping?: OnStopping): void {
		const nextState = this.factories.started.create({
			startingPromise: Promise.resolve(),
			onStoppings: onStopping ? [onStopping] : [],
		});
		this.startable.setState(nextState);
	}
}


export namespace Stopped {
	export interface FactoryDeps {
		starting: StartingLike.FactoryLike;
		started: StartedLike.FactoryLike;
	}

	import FactoryLike = StoppedLike.FactoryLike;
	import Args = StoppedLike.FactoryLike.Args;

	export class Factory implements FactoryLike {
		private container = new Container();
		@inject(Stopped.FactoryDeps)
		private factories!: Stopped.FactoryDeps;
		@inject(FriendlyStartableLike)
		private startable!: FriendlyStartableLike;


		public constructor() {
			this.container.register(
				Stopped.FactoryDeps,
				() => this.factories,
			);
			this.container.register(
				FriendlyStartableLike,
				() => this.startable,
			);
		}

		public create(args: Args): Stopped {
			return this.container.inject(
				new Stopped(
					args,
					this.startable,
				),
			);
		}
	}
}

export class CannotFailDuringStopped extends Error {
	constructor() {
		super('Cannot call .fail() during STOPPED.');
	}
}
