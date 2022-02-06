import { EventEmitter } from 'events';
import { boundMethod } from 'autobind-decorator';
import {
	StartableLike,
	OnStopping,
	ReadyState,
} from './interfaces';
import { State } from './states';

export abstract class Startable extends EventEmitter implements StartableLike {
	protected abstract Startable$rawStart(): Promise<void>;
	protected abstract Startable$rawStop(): Promise<void>;

	private Startble$state: State = new State.Stopped(
		this,
		state => { this.Startble$state = state; },
		{
			rawStart: this.Startable$rawStart,
			rawStop: this.Startable$rawStop,
			stoppingPromise: Promise.resolve(),
		},
		{},
	);

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.Startble$state.start(onStopping);
	}

	@boundMethod
	public stop(err?: Error): Promise<void> {
		const promise = this.Startble$state.stop(err);
		promise.catch(() => { });
		return promise;
	}

	public getReadyState(): ReadyState {
		return this.Startble$state.readyState;
	}
}
