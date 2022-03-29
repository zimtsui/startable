import { Container } from 'injektor';
import {
	FriendlyStartable,
	initialState,
} from './friendly-startable';
import {
	OnStopping,
	RawStart,
	RawStop,
	StartableLike,
	ReadyState,
} from './startable-like';
import { boundMethod } from 'autobind-decorator';

import { StoppedLike } from './states/stopped/stopped-like';
import { StartingLike } from './states/starting/starting-like';
import { StartedLike } from './states/started/started-like';
import { StoppingLike } from './states/stopping/stopping-like';

import { Stopped } from './states/stopped/stopped';
import { Starting } from './states/starting/starting';
import { Started } from './states/started/started';
import { Stopping } from './states/stopping/stopping';

export class Startable implements StartableLike {
	private friendly: FriendlyStartable;
	private container = new Container();

	public constructor(
		rawStart: RawStart,
		rawStop: RawStop,
	) {
		const stoppedFactory = new Stopped.Factory();
		this.container.register(
			StoppedLike.FactoryLike,
			() => stoppedFactory,
		);
		const startingFactory = new Starting.Factory();
		this.container.register(
			StartingLike.FactoryLike,
			() => startingFactory,
		);
		const startedFactory = new Started.Factory();
		this.container.register(
			StartedLike.FactoryLike,
			() => startedFactory,
		);
		const stoppingFactory = new Stopping.Factory();
		this.container.register(
			StoppingLike.FactoryLike,
			() => stoppingFactory,
		);
		this.container.register(
			FriendlyStartable,
			() => this.friendly,
		);
		this.friendly = new FriendlyStartable(rawStart, rawStop);
		this.container.register(
			initialState,
			() => stoppedFactory.create({
				stoppingPromise: Promise.resolve(),
			}),
		);
		this.container.inject(stoppedFactory);
		this.container.inject(startingFactory);
		this.container.inject(startedFactory);
		this.container.inject(stoppingFactory);
		this.container.inject(this.friendly);
	}

	public getReadyState(): ReadyState {
		return this.friendly.getReadyState();
	}

	public async tryStart(onStopping?: OnStopping): Promise<void> {
		await this.friendly.tryStart(onStopping);
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.friendly.start(onStopping);
	}

	public async tryStop(err?: Error): Promise<void> {
		await this.friendly.tryStop(err);
	}

	@boundMethod
	public stop(err?: Error): Promise<void> {
		const promise = this.friendly.stop(err);
		promise.catch(() => { });
		return promise;
	}

	public async fail(err: Error): Promise<void> {
		this.friendly.fail(err);
	}

	public skipStart(onStopping?: OnStopping): void {
		this.friendly.skipStart(onStopping);
	}
}
