import {
	Friendly,
	Startable,
	State,
} from '../../startable';
import {
	OnStopping,
	ReadyState,
} from '../../startable-like';
import { FactoryDeps } from './factory-deps';
import { Args } from './args';


export class Started<StartArgs extends unknown[]> extends State<StartArgs> {
	private startingPromise: Promise<void>;
	private onStoppings: OnStopping[];

	public constructor(
		args: Args,
		protected host: Startable<StartArgs>,
		private factories: FactoryDeps<StartArgs>,
	) {
		super();

		this.startingPromise = args.startingPromise;
		this.onStoppings = args.onStoppings;
	}

	public postActivate(): void { }

	public async start(
		startArgs: StartArgs,
		onStopping?: OnStopping,
	): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async assart(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async stop(err?: Error): Promise<void> {
		const nextState = this.factories.stopping.create(
			this.host,
			{
				startingPromise: this.startingPromise,
				onStoppings: this.onStoppings,
				err,
			},
		);
		(<Friendly<StartArgs>>this.host).state = nextState;
		nextState.postActivate();
		await this.host.stop();
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

	public getStarting(): Promise<void> {
		return this.startingPromise;
	}

	public getStopping(): Promise<void> {
		throw new CannotGetStoppingDuringStarted();
	}
}

export class CannotSkipStartDuringStarted extends Error { }

export class CannotGetStoppingDuringStarted extends Error { }
