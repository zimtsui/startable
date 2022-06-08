import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { FactoryDeps } from './factory-deps';
import { Args } from './args';


export class Started implements StateLike {
	[STATE_LIKE_NOMINAL]: void;

	private startingPromise: Promise<void>;
	private onStoppings: OnStopping[];

	public constructor(
		args: Args,
		private startable: FriendlyStartableLike,
		private factories: FactoryDeps,
	) {
		this.startingPromise = args.startingPromise;
		this.onStoppings = args.onStoppings;
	}

	public postActivate(): void { }

	public async start(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async assart(onStopping?: OnStopping): Promise<void> {
		await this.start(onStopping);
	}

	public async stop(err?: Error): Promise<void> {
		const nextState = this.factories.stopping.create({
			startingPromise: this.startingPromise,
			onStoppings: this.onStoppings,
			err,
		});
		this.startable.setState(nextState);
		nextState.postActivate();
		await this.startable.stop();
	}

	public async starp(err?: Error): Promise<void> {
		await this.stop(err);
	}

	public getReadyState(): ReadyState {
		return ReadyState.STARTED;
	}

	public skipStart(onStopping?: OnStopping): never {
		throw new CannotSkipStartDuringStarted();
	}
}

export class CannotSkipStartDuringStarted extends Error {
	public constructor() {
		super('Cannot call .skipStart() during STARTED.');
	}
}
