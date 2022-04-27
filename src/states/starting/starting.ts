import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike, STATE_LIKE_NOMINAL } from '../../state-like';
import { instantInject, Container } from 'injektor';
import { PublicManualPromise } from '../../public-manual-promise';
import { FriendlyStartableLike } from '../../friendly-startable-like';
import { StartingLike, CannotSkipStartDuringStarting } from './starting-like';

import { StartedLike } from '../started/started-like';


export class Starting implements StateLike {
	[STATE_LIKE_NOMINAL]: void;

	private startingPromise = PublicManualPromise.create();
	private stoppingPromise: Promise<void>;
	private onStoppings: OnStopping[] = [];
	private manualFailure: null | Error = null;

	public constructor(
		args: StartingLike.FactoryLike.Args,
		private startable: FriendlyStartableLike<Starting.FactoryDeps>,
	) {
		if (args.onStopping) this.onStoppings.push(args.onStopping);
		this.stoppingPromise = args.stoppingPromise;

		this.startable.setState(this);

		this.startable.rawStart().then(() => {
			if (this.manualFailure) throw this.manualFailure;
			this.startingPromise.resolve();
		}).catch((err: Error) => {
			this.startingPromise.reject(err);
		}).then(() => {
			this.startable.factories.started.create({
				onStoppings: this.onStoppings,
				startingPromise: this.startingPromise,
			})
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


export namespace Starting {
	export interface FactoryDeps {
		started: StartedLike.FactoryLike;
	}

	export class Factory implements StartingLike.FactoryLike {
		private container = new Container();
		@instantInject(FriendlyStartableLike)
		private startable!: FriendlyStartableLike<Starting.FactoryDeps>;

		public create(args: StartingLike.FactoryLike.Args): Starting {
			return new Starting(
				args,
				this.startable,
			);
		}
	}
}

export class StarpCalledDuringStarting extends Error {
	public constructor() {
		super('.starp() is called during STARTING.');
	}
}
