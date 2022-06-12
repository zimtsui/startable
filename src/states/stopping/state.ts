import {
	OnStopping,
	ReadyState,
	Startable,
	Friendly,
	State,
} from '../../startable';
import { PublicManualPromise } from '../../public-manual-promise';
import { Args } from './args';
import { FactoryDeps } from './factory-deps';



export class Stopping extends State {
	private startingPromise: Promise<void>;
	private stoppingPromise = PublicManualPromise.create();
	private onStoppings: OnStopping[];

	public constructor(
		private args: Args,
		protected host: Startable,
		private factories: FactoryDeps,
	) {
		super();

		this.startingPromise = args.startingPromise;
		this.onStoppings = args.onStoppings;
	}

	public postActivate(): void {
		for (const onStopping of this.onStoppings)
			onStopping(this.args.err);

		(<Friendly>this.host).rawStop(this.args.err).then(() => {
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
			(<Friendly>this.host).state = nextState;
			nextState.postActivate();
		});
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.startingPromise;
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