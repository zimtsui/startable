import {
	Startable,
	Friendly,
	State,
} from '../../startable';
import {
	OnStopping,
	ReadyState,
} from '../../startable-like';
import { PublicManualPromise } from '../../public-manual-promise';
import { Args } from './args';
import { FactoryDeps } from './factory-deps';



export class Stopping<StartArgs extends unknown[]> extends State<StartArgs> {
	private startingPromise: Promise<void>;
	private stoppingPromise = PublicManualPromise.create();
	private onStoppings: OnStopping[];

	public constructor(
		private args: Args,
		protected host: Startable<StartArgs>,
		private factories: FactoryDeps<StartArgs>,
	) {
		super();

		this.startingPromise = args.startingPromise;
		this.onStoppings = args.onStoppings;
	}

	public postActivate(): void {
		for (const onStopping of this.onStoppings)
			onStopping(this.args.err);

		(<Friendly<StartArgs>>this.host).rawStop(this.args.err).then(() => {
			this.stoppingPromise.resolve();
		}).catch((err: Error) => {
			this.stoppingPromise.reject(err);
		}).then(() => {
			const nextState = this.factories.stopped.create(
				this.host,
				{
					stoppingPromise: this.stoppingPromise,
				},
			);
			(<Friendly<StartArgs>>this.host).state = nextState;
			nextState.postActivate();
		});
	}

	public async start(
		startArgs: StartArgs,
		onStopping?: OnStopping,
	): Promise<void> {
		throw new CannotStartDuringStopping();
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

	public getStarting(): Promise<void> {
		return this.startingPromise;
	}

	public getStopping(): Promise<void> {
		return this.stoppingPromise;
	}
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

export class CannotStartDuringStopping extends Error { }
