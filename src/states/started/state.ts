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


export class Started extends State {
	private startingPromise: Promise<void>;
	private onStoppings: OnStopping[];

	public constructor(
		args: Args,
		protected host: Startable,
		private factories: FactoryDeps,
	) {
		super();

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
		const nextState = this.factories.stopping.create(
			this.host,
			{
				startingPromise: this.startingPromise,
				onStoppings: this.onStoppings,
				err,
			},
		);
		(<Friendly>this.host).state = nextState;
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
}

export class CannotSkipStartDuringStarted extends Error {
	public constructor() {
		super('Cannot call .skipStart() during STARTED.');
	}
}
