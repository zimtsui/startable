import { inject, Container } from 'injektor';
import {
	OnStopping,
	RawStart,
	RawStop,
	ReadyState,
	StartableLike,
} from './startable-like';
import { FriendlyStartableLike } from './friendly-startable-like';

import { Stopped } from './states/stopped/stopped';
import { Starting } from './states/starting/starting';
import { Started } from './states/started/started';
import { Stopping } from './states/stopping/stopping';


export class FriendlyStartable implements StartableLike {
	private container = new Container();
	private state: StartableLike;

	public constructor(
		public rawStart: RawStart,
		public rawStop: RawStop,
	) {
		const factories = {
			stopped: new Stopped.Factory(),
			starting: new Starting.Factory(),
			started: new Started.Factory(),
			stopping: new Stopping.Factory(),
		};

		this.container.register<Stopped.FactoryDeps>(Stopped.FactoryDeps, () => factories);
		this.container.register<Starting.FactoryDeps>(Starting.FactoryDeps, () => factories);
		this.container.register<Started.FactoryDeps>(Started.FactoryDeps, () => factories);
		this.container.register<Stopping.FactoryDeps>(Stopping.FactoryDeps, () => factories);
		this.container.register(FriendlyStartableLike, () => this);
		this.container.inject(factories.stopped);
		this.container.inject(factories.starting);
		this.container.inject(factories.started);
		this.container.inject(factories.stopping);

		this.state = factories.stopped.create({
			stoppingPromise: Promise.resolve(),
		});
	}

	public setState(state: StartableLike): void {
		this.state = state;
	}

	public getState(): StartableLike {
		return this.state;
	}

	public getReadyState(): ReadyState {
		return this.state.getReadyState();
	}

	public skipStart(onStopping?: OnStopping): void {
		this.state.skipStart(onStopping);
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.state.start(onStopping);
	}

	public async starp(err?: Error): Promise<void> {
		await this.state.starp(err);
	}

	public async stop(err?: Error): Promise<void> {
		await this.state.stop(err);
	}
}
