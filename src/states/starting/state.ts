import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import { PublicManualPromise } from '../../public-manual-promise';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { FactoryDeps } from './factory-deps';
import { Args } from './args';



export class Starting implements StateLike {
	[STATE_LIKE_NOMINAL]: void;

	private startingPromise = PublicManualPromise.create();
	private stoppingPromise: Promise<void>;
	private onStoppings: OnStopping[] = [];
	private manualFailure: null | Error = null;

	public constructor(
		args: Args,
		private startable: FriendlyStartableLike,
		private factories: FactoryDeps,
	) {
		if (args.onStopping) this.onStoppings.push(args.onStopping);
		this.stoppingPromise = args.stoppingPromise;
	}

	public postActivate(): void {
		this.startable.rawStart().then(() => {
			if (this.manualFailure) throw this.manualFailure;
			this.startingPromise.resolve();
		}).catch((err: Error) => {
			this.startingPromise.reject(err);
		}).then(() => {
			const nextState = this.factories.started.create({
				onStoppings: this.onStoppings,
				startingPromise: this.startingPromise,
			})
			this.startable.setState(nextState);
			nextState.postActivate();
		});
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async assart(onStopping?: OnStopping): Promise<void> {
		await this.start(onStopping);
	}

	public async stop(err?: Error): Promise<void> {
		await this.stoppingPromise;
	}

	public async starp(err?: Error): Promise<void> {
		this.manualFailure = new StarpCalledDuringStarting();
		await this.startingPromise.catch(() => { });
		await this.startable.stop(err);
	}

	public getReadyState(): ReadyState {
		return ReadyState.STARTING;
	}

	public skipStart(onStopping?: OnStopping): never {
		throw new CannotSkipStartDuringStarting();
	}
}

export class StarpCalledDuringStarting extends Error {
	public constructor() {
		super('.starp() is called during STARTING.');
	}
}

export class CannotSkipStartDuringStarting extends Error {
	public constructor() {
		super('Cannot call .skipStart() during STARTING.');
	}
}
