import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import { PublicManualPromise } from '../../public-manual-promise';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { Args } from './args';
import { FactoryDeps } from './factory-deps';



export class Stopping implements StateLike {
	[STATE_LIKE_NOMINAL]: void;

	private startingPromise: Promise<void>;
	private stoppingPromise = PublicManualPromise.create();
	private onStoppings: OnStopping[];

	public constructor(
		args: Args,
		private startable: FriendlyStartableLike,
		private factories: FactoryDeps,
	) {
		this.startingPromise = args.startingPromise;
		this.onStoppings = args.onStoppings;

		this.startable.setState(this);

		for (const onStopping of this.onStoppings) onStopping(args.err);

		this.startable.rawStop(args.err).then(() => {
			this.stoppingPromise.resolve();
		}).catch((err: Error) => {
			this.stoppingPromise.reject(err);
		}).then(() => {
			this.factories.stopped.create({
				stoppingPromise: this.stoppingPromise,
			});
		});
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.startingPromise;
	}

	public async assart(onStopping?: OnStopping): Promise<never> {
		throw new CannotAssartDuringStopping();
	}

	public async stop(err?: Error): Promise<void> {
		await this.stoppingPromise;
	}

	public async starp(err?: Error): Promise<void> {
		await this.stop(err);
	}

	public getReadyState(): ReadyState {
		return ReadyState.STOPPING;
	}

	public skipStart(onStopping?: OnStopping): never {
		throw new CannotSkipStartDuringStopping();
	}
}

export namespace Stopping {



}

export class CannotSkipStartDuringStopping extends Error {
	public constructor() {
		super('Cannot call .skipStart() during STOPPING.');
	}
}

export class CannotAssartDuringStopping extends Error {
	public constructor() {
		super('Cannot call .assart() during STOPPING.');
	}
}
