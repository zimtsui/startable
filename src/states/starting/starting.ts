import { inject, Container } from 'injektor';
import {
	OnStopping,
	ReadyState,
} from '../../startable-like';
import { ManualPromise } from 'manual-promise';
import { StartingLike } from './starting-like';
import { FriendlyStartable } from '../../friendly-startable';

import { StartedLike } from '../started/started-like';


export class Starting implements StartingLike {
	private startingPromise = new ManualPromise();
	private onStoppings: OnStopping[] = [];
	private manualFailure: null | Error = null;

	@inject(StartedLike.FactoryLike)
	private startedFactory!: StartedLike.FactoryLike;

	constructor(
		args: Starting.Args,
		private startable: FriendlyStartable,
	) {
		if (args.onStopping) this.onStoppings.push(args.onStopping);

		// https://github.com/microsoft/TypeScript/issues/38929
		this.setup();
	}

	public getStartingPromise(): Promise<void> {
		return this.startingPromise;
	}

	private async setup(): Promise<void> {
		try {
			await this.startable.rawStart();
			if (this.manualFailure) throw this.manualFailure;
			this.startingPromise.resolve();
		} catch (err) {
			this.startingPromise.reject(<Error>err);
		}
		const nextState = this.startedFactory.create({
			onStoppings: this.onStoppings,
			startingPromise: this.startingPromise,
		});
		this.startable.setState(nextState);
	}

	public async tryStart(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.tryStart(onStopping);
	}

	public async tryStop(err?: Error): Promise<never> {
		throw new CannotTryStopDuringStarting();
	}

	public async stop(err?: Error): Promise<void> {
		this.fail(new StopCalledDuringStarting());
		await this.startingPromise.catch(() => { });
		await this.startable.stop(err);
	}

	public async fail(err: Error): Promise<void> {
		this.manualFailure = err;
		await this.startingPromise.catch(() => { });
	}

	public getReadyState(): ReadyState {
		return ReadyState.STARTING;
	}

	public skipStart(onStopping?: OnStopping): never {
		throw new CannotSkipStartDuringStarting();
	}
}


export namespace Starting {
	export import Args = StartingLike.FactoryLike.Args;

	export class Factory implements StartingLike.FactoryLike {
		private container = new Container();
		@inject(StartedLike.FactoryLike)
		private startedFactory!: StartedLike.FactoryLike;
		@inject(FriendlyStartable)
		private startable!: FriendlyStartable;

		public constructor() {
			this.container.register(
				StartedLike.FactoryLike,
				() => this.startedFactory,
			);
			this.container.register(
				FriendlyStartable,
				() => this.startable,
			);
		}
		public create(args: Args): Starting {
			return this.container.inject(
				new Starting(
					args,
					this.startable,
				),
			);
		}
	}
}

export class StopCalledDuringStarting extends Error {
	constructor() {
		super('.stop() is called during STARTING.');
	}
}

export class CannotTryStopDuringStarting extends Error {
	constructor() {
		super('Cannot call .tryStop() during STARTING.');
	}
}
export class CannotSkipStartDuringStarting extends Error {
	constructor() {
		super('Cannot call .skipStart() during STARTING.');
	}
}
