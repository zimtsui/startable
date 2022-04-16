import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_TYPE } from '../../state-like';
import { StoppedLike, CannotStopDuringStopped } from './stopped-like';
import { inject, Container } from 'injektor';
import { FriendlyStartableLike } from '../../friendly-startable-like';

import { StartingLike } from '../starting/starting-like';
import { StartedLike } from '../started/started-like';


export class Stopped implements StateLike {
	[STATE_LIKE_TYPE]: void;
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

	public async start(onStopping?: OnStopping): Promise<void> {
		const nextState = this.factories.starting.create({
			onStopping,
			stoppingPromise: this.stoppingPromise,
		});
		this.startable.setState(nextState);
		await this.startable.start();
	}

	public async assart(onStopping?: OnStopping): Promise<never> {
		throw new CannotAssartDuringStopped();
	}

	public async stop(): Promise<never> {
		throw new CannotStopDuringStopped();
	}

	public async starp(err?: Error): Promise<never> {
		throw new CannotStarpDuringStopped();
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

	export class Factory implements StoppedLike.FactoryLike {
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

		public create(args: StoppedLike.FactoryLike.Args): Stopped {
			return this.container.inject(
				new Stopped(
					args,
					this.startable,
				),
			);
		}
	}
}

export class CannotStarpDuringStopped extends Error {
	public constructor() {
		super('Cannot call .starp() during STOPPED.');
	}
}

export class CannotAssartDuringStopped extends Error {
	public constructor() {
		super('Cannot call .assart() during STOPPED.');
	}
}
