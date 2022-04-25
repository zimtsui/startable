import { FriendlyStartable } from './friendly-startable';
import {
	RawStart,
	RawStop,
	StartableLike,
	OnStopping,
	ReadyState,
} from './startable-like';
import { boundMethod } from 'autobind-decorator';

export class Startable implements StartableLike {
	private friendly: FriendlyStartable;

	public constructor(
		rawStart: RawStart,
		rawStop: RawStop,
	) {
		this.friendly = new FriendlyStartable(rawStart, rawStop);
	}

	public getReadyState(): ReadyState {
		return this.friendly.getReadyState();
	}

	public skipStart(onStopping?: OnStopping): void {
		this.friendly.skipStart(onStopping);
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.friendly.start(onStopping);
	}

	public async assart(onStopping?: OnStopping): Promise<void> {
		await this.friendly.assart(onStopping);
	}

	public async stop(err?: Error): Promise<void> {
		await this.friendly.stop(err);
	}

	@boundMethod
	public starp(err?: Error): Promise<void> {
		const promise = this.friendly.starp(err);
		promise.catch(() => { });
		return promise;
	}
}
