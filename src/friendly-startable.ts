import {
	StateLike,
	Factories,
	FriendlyStartableLike,
} from './friendly-startable-like';
import {
	OnStopping,
	RawStart,
	RawStop,
	ReadyState,
} from './startable-like';
import { Stopped } from './states/stopped';
import { Starting } from './states/starting';
import { Started } from './states/started';
import { Stopping } from './states/stopping';


export class FriendlyStartable implements FriendlyStartableLike {
	public readonly factories: Factories = {
		stopped: new Stopped.Factory(this),
		starting: new Starting.Factory(this),
		started: new Started.Factory(this),
		stopping: new Stopping.Factory(this),
	};

	constructor(
		public readonly rawStart: RawStart,
		public readonly rawStop: RawStop,
	) { }

	public getReadyState(): ReadyState {
		return this.state.getReadyState();
	}

	public skipStart(onStopping?: OnStopping): void {
		this.state.skipStart(onStopping);
	}

	public state: StateLike = this.factories.stopped.create({
		stoppingPromise: Promise.resolve(),
	});

	public async tryStart(onStopping?: OnStopping): Promise<void> {
		await this.state.tryStart(onStopping);
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.state.start(onStopping);
	}

	public async tryStop(err?: Error): Promise<void> {
		await this.state.tryStop(err);
	}

	public async stop(err?: Error): Promise<void> {
		await this.state.stop(err);
	}

	public async fail(err: Error): Promise<void> {
		await this.state.fail(err);
	}
}
