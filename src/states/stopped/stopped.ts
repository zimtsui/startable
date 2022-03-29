import {
	OnStopping,
	ReadyState,
	CannotFail,
} from '../../startable-like';
import { StoppedLike } from './stopped-like';
import assert = require('assert');
import { inject, Container } from 'injektor';

import { StartingLike } from '../starting/starting-like';
import { StartedLike } from '../started/started-like';
import { FriendlyStartable } from '../../friendly-startable';


export class Stopped implements StoppedLike {
	private stoppingPromise: Promise<void>;

	@inject(StartingLike.FactoryLike)
	private startingFactory!: StartingLike.FactoryLike;
	@inject(StartedLike.FactoryLike)
	private startedFactory!: StartedLike.FactoryLike;

	public constructor(
		args: StoppedLike.FactoryLike.Args,
		private startable: FriendlyStartable,
	) {
		this.stoppingPromise = args.stoppingPromise;
	}

	public getStoppingPromise(): Promise<void> {
		return this.stoppingPromise;
	}

	public async tryStart(onStopping?: OnStopping): Promise<void> {
		const nextState = this.startingFactory.create({
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
		const nextState = this.startedFactory.create({
			startingPromise: Promise.resolve(),
			onStoppings: onStopping ? [onStopping] : [],
		});
		this.startable.setState(nextState);
	}
}


export namespace Stopped {
	import FactoryLike = StoppedLike.FactoryLike;
	import Args = StoppedLike.FactoryLike.Args;

	export class Factory implements FactoryLike {
		private container = new Container();
		@inject(StartingLike.FactoryLike)
		private startingFactory!: StartingLike.FactoryLike;
		@inject(StartedLike.FactoryLike)
		private startedFactory!: StartedLike.FactoryLike;
		@inject(FriendlyStartable)
		private startable!: FriendlyStartable;


		public constructor() {
			this.container.register(
				StartingLike.FactoryLike,
				() => this.startingFactory,
			);
			this.container.register(
				StartedLike.FactoryLike,
				() => this.startedFactory,
			);
			this.container.register(
				FriendlyStartable,
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

export class CannotFailDuringStopped extends CannotFail {
	constructor() {
		super('Cannot call .fail() during STOPPED.');
	}
}
