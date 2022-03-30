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
		const factories = {
			stopped: new Stopped.Factory(),
			starting: new Starting.Factory(),
			started: new Started.Factory(),
			stopping: new Stopping.Factory(),
		};
		this.friendly = new FriendlyStartable(rawStart, rawStop);

		this.container.register<Stopped.FactoryDeps>(Stopped.FactoryDeps, () => factories);
		this.container.register<Starting.FactoryDeps>(Starting.FactoryDeps, () => factories);
		this.container.register<Started.FactoryDeps>(Started.FactoryDeps, () => factories);
		this.container.register<Stopping.FactoryDeps>(Stopping.FactoryDeps, () => factories);
		this.container.register(FriendlyStartable, () => this.friendly);
		this.container.inject(factories.stopped);
		this.container.inject(factories.starting);
		this.container.inject(factories.started);
		this.container.inject(factories.stopping);

		this.container.register(
			initialState,
			() => factories.stopped.create({
				stoppingPromise: Promise.resolve(),
			}),
		);
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
