import {
	Startable,
	State,
	Friendly,
} from '../../startable';
import {
	OnStopping,
	ReadyState,
} from '../../startable-like';
import { FactoryDeps } from './factory-deps';
import { Args } from './args';



export class Stopped<StartArgs extends unknown[]> extends State<StartArgs> {
	private stoppingPromise: Promise<void>;

	public constructor(
		args: Args,
		protected host: Startable<StartArgs>,
		private factories: FactoryDeps<StartArgs>,
	) {
		super();

		this.stoppingPromise = args.stoppingPromise;
	}

	public postActivate(): void { }

	public async start(
		startArgs: StartArgs,
		onStopping?: OnStopping,
	): Promise<void> {
		const nextState = this.factories.starting.create(
			this.host,
			{
				onStopping,
				stoppingPromise: this.stoppingPromise,
				startArgs,
			});
		(<Friendly<StartArgs>>this.host).state = nextState;
		nextState.postActivate();
		await this.host.start(startArgs);
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
		const nextState = this.factories.started.create(
			this.host,
			{
				startingPromise: Promise.resolve(),
				onStoppings: onStopping ? [onStopping] : [],
			},
		);
		(<Friendly<StartArgs>>this.host).state = nextState;
		nextState.postActivate();
	}

	public getStarting(): Promise<void> {
		throw new CannotGetStartingDuringStopped();
	}

	public getStopping(): Promise<void> {
		return this.stoppingPromise;
	}
}

export class CannotStarpDuringStopped extends Error { }

export class CannotAssartDuringStopped extends Error { }

export class CannotGetStartingDuringStopped extends Error { }
