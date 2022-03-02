import {
	FriendlyStartableLike,
} from './friendly-startable-like';
import {
	OnStopping,
	RawStart,
	RawStop,
	StartableLike,
	ReadyState,
} from './startable-like';
import { boundMethod } from 'autobind-decorator';
import { FriendlyStartable } from './friendly-startable';


export class Startable implements StartableLike {
	protected friendly: FriendlyStartableLike;

	constructor(
		rawStart: RawStart,
		rawStop: RawStop,
	) {
		this.friendly = new FriendlyStartable(rawStart, rawStop);
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
}
