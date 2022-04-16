import { OnStopping, ReadyState } from '../../startable-like';
import { StateLike } from '../../state-like';
import { inject, Container } from 'injektor';
import { PublicManualPromise } from '../../public-manual-promise';
import { StartingLike } from './starting-like';
import { FriendlyStartableLike } from '../../friendly-startable-like';

import { StartedLike } from '../started/started-like';


export class Starting implements StateLike {
	private startingPromise = PublicManualPromise.create();
	private stoppingPromise: Promise<void>;
	private onStoppings: OnStopping[] = [];
	private manualFailure: null | Error = null;

	public static FactoryDeps = {};
	@inject(Starting.FactoryDeps)
	private factories!: Starting.FactoryDeps;

	public constructor(
		args: StartingLike.FactoryLike.Args,
		private startable: FriendlyStartableLike,
	) {
		if (args.onStopping) this.onStoppings.push(args.onStopping);
		this.stoppingPromise = args.stoppingPromise;

		// https://github.com/microsoft/TypeScript/issues/38929
		this.setup();
	}

	private async setup(): Promise<void> {
		try {
			await this.startable.rawStart();
			if (this.manualFailure) throw this.manualFailure;
			this.startingPromise.resolve();
		} catch (err) {
			this.startingPromise.reject(<Error>err);
		}
		const nextState = this.factories.started.create({
			onStoppings: this.onStoppings,
			startingPromise: this.startingPromise,
		});
		this.startable.setState(nextState);
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
		@inject(Starting.FactoryDeps)
		private factories!: Starting.FactoryDeps;
		@inject(FriendlyStartableLike)
		private startable!: FriendlyStartableLike;

		public constructor() {
			this.container.register(
				Starting.FactoryDeps,
				() => this.factories,
			);
			this.container.register(
				FriendlyStartableLike,
				() => this.startable,
			);
		}
		public create(args: StartingLike.FactoryLike.Args): Starting {
			return this.container.inject(
				new Starting(
					args,
					this.startable,
				),
			);
		}
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