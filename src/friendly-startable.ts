import {
	OnStopping,
	RawStart,
	RawStop,
	ReadyState,
} from './startable-like';
import { StateLike } from './state-like';
import { FriendlyStartableLike } from './friendly-startable-like';
import { Factories } from './factories';
import { TYPES } from './injection/types';
import { inject, instantInject } from '@zimtsui/injektor';



export class FriendlyStartable implements FriendlyStartableLike {
	private state!: StateLike;

	public constructor(
		@inject(TYPES.RawStart)
		public rawStart: RawStart,
		@inject(TYPES.RawStop)
		public rawStop: RawStop,
	) {
		// this.factories.stopped.create({
		// 	stoppingPromise: Promise.resolve(),
		// });
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
