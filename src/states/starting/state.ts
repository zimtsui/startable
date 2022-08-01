import {
	Startable,
	State,
	Friendly,
} from '../../startable';
import {
	OnStopping,
	ReadyState,
} from '../../startable-like';
import { PublicManualPromise } from '../../public-manual-promise';
import { FactoryDeps } from './factory-deps';
import { Args } from './args';



export class Starting<StartArgs extends unknown[]> extends State<StartArgs> {
	private startingPromise = PublicManualPromise.create();
	private stoppingPromise: Promise<void>;
	private onStoppings: OnStopping[] = [];
	private manualFailure: null | Error = null;
	private startArgs: StartArgs;

	public constructor(
		args: Args<StartArgs>,
		protected host: Startable<StartArgs>,
		private factories: FactoryDeps<StartArgs>,
	) {
		super();

		if (args.onStopping) this.onStoppings.push(args.onStopping);
		this.stoppingPromise = args.stoppingPromise;
		this.startArgs = args.startArgs;
	}

	public postActivate(): void {
		(<Friendly<StartArgs>>this.host).rawStart(...this.startArgs).then(() => {
			if (this.manualFailure) throw this.manualFailure;
			this.startingPromise.resolve();
		}).catch((err: Error) => {
			this.startingPromise.reject(err);
		}).then(() => {
			const nextState = this.factories.started.create(
				this.host,
				{
					onStoppings: this.onStoppings,
					startingPromise: this.startingPromise,
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
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async assart(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async stop(err?: Error): Promise<void> {
		await this.stoppingPromise;
	}

	public async starp(err?: Error): Promise<void> {
		this.manualFailure = new StarpCalledDuringStarting();
		await this.startingPromise.catch(() => { });
		await this.host.stop(err);
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
