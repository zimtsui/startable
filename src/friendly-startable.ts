import { Container } from 'injektor';
import {
	OnStopping,
	RawStart,
	RawStop,
	ReadyState,
	StartableLike,
} from './startable-like';
import { StateLike } from './state-like';
import { FriendlyStartableLike } from './friendly-startable-like';

import { Stopped } from './states/stopped/stopped';
import { Starting } from './states/starting/starting';
import { Started } from './states/started/started';
import { Stopping } from './states/stopping/stopping';

interface Factories extends
	Stopped.FactoryDeps,
	Starting.FactoryDeps,
	Started.FactoryDeps,
	Stopping.FactoryDeps { }

export class FriendlyStartable implements StartableLike {
	private container = new Container();
	private state: StateLike;
	private factories: Factories;

	public constructor(
		public rawStart: RawStart,
		public rawStop: RawStop,
	) {
		this.container.registerFactorySingleton(FriendlyStartableLike, () => this);
		this.container.registerConstructorSingleton(Stopped.Factory, Stopped.Factory);
		this.container.registerConstructorSingleton(Starting.Factory, Starting.Factory);
		this.container.registerConstructorSingleton(Started.Factory, Started.Factory);
		this.container.registerConstructorSingleton(Stopping.Factory, Stopping.Factory);
		this.factories = {
			stopped: this.container.initiate(Stopped.Factory),
			starting: this.container.initiate(Starting.Factory),
			started: this.container.initiate(Started.Factory),
			stopping: this.container.initiate(Stopping.Factory),
		};

		this.state = this.factories.stopped.create({
			stoppingPromise: Promise.resolve(),
		});
	}

	public setState(state: StateLike): void {
		this.state = state;
	}

	public getState(): StateLike {
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

	public async assart(onStopping?: OnStopping): Promise<void> {
		await this.state.assart(onStopping);
	}

	public async starp(err?: Error): Promise<void> {
		await this.state.starp(err);
	}

	public async stop(err?: Error): Promise<void> {
		await this.state.stop(err);
	}
}
