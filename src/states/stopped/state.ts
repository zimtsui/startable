import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import { FactoryDeps } from './factory-deps';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { Args } from './args';



export class Stopped implements StateLike {
	[STATE_LIKE_NOMINAL]: void;
	private stoppingPromise: Promise<void>;

	public constructor(
		args: Args,
		private startable: FriendlyStartableLike,
		private factories: FactoryDeps,
	) {
		this.stoppingPromise = args.stoppingPromise;
		this.startable.setState(this);
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		this.factories.starting.create({
			onStopping,
			stoppingPromise: this.stoppingPromise,
		});
		await this.startable.start();
	}

	public async assart(onStopping?: OnStopping): Promise<never> {
		throw new CannotAssartDuringStopped();
	}

	public async stop(): Promise<void> {
		await this.stoppingPromise;
	}

	public async starp(err?: Error): Promise<never> {
		throw new CannotStarpDuringStopped();
	}

	public getReadyState(): ReadyState {
		return ReadyState.STOPPED;
	}

	public skipStart(onStopping?: OnStopping): void {
		const nextState = this.factories.started.create({
			startingPromise: Promise.resolve(),
			onStoppings: onStopping ? [onStopping] : [],
		});
		this.startable.setState(nextState);
	}
}

export class CannotStarpDuringStopped extends Error {
	public constructor() {
		super('Cannot call .starp() during STOPPED.');
	}
}

export class CannotAssartDuringStopped extends Error {
	public constructor() {
		super('Cannot call .assart() during STOPPED.');
	}
}
