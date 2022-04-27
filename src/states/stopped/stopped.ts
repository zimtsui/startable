import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import {
	StoppedLike,
	CannotAssartDuringStopped,
	CannotStarpDuringStopped,
} from './stopped-like';
import { instantInject, Container } from 'injektor';
import { FriendlyStartableLike } from '../../friendly-startable-like';

import { StartingLike } from '../starting/starting-like';
import { StartedLike } from '../started/started-like';


export class Stopped implements StateLike {
	[STATE_LIKE_NOMINAL]: void;
	private stoppingPromise: Promise<void>;

	public constructor(
		args: StoppedLike.FactoryLike.Args,
		private startable: FriendlyStartableLike<Stopped.FactoryDeps>,
	) {
		this.stoppingPromise = args.stoppingPromise;
		this.startable.setState(this);
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		this.startable.factories.starting.create({
			onStopping,
			stoppingPromise: this.stoppingPromise,
		});
		await this.startable.start();
	}

	public async assart(onStopping?: OnStopping): Promise<never> {
		throw new CannotAssartDuringStopped();
	}

	public async stop(): Promise<void> {
		await this.stoppingPromise;
	}

	public async starp(err?: Error): Promise<never> {
		throw new CannotStarpDuringStopped();
	}

	public getReadyState(): ReadyState {
		return ReadyState.STOPPED;
	}

	public skipStart(onStopping?: OnStopping): void {
		const nextState = this.startable.factories.started.create({
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
		@instantInject(FriendlyStartableLike)
		private startable!: FriendlyStartableLike<Stopped.FactoryDeps>;

		public create(args: StoppedLike.FactoryLike.Args): Stopped {
			return new Stopped(
				args,
				this.startable,
			);
		}
	}
}
