import {
	OnStopping,
	ReadyState,
	Startable,
	State,
	Friendly,
} from '../../startable';
import { FactoryDeps } from './factory-deps';
import { Args } from './args';



export class Stopped extends State {
	private stoppingPromise: Promise<void>;

	public constructor(
		args: Args,
		protected host: Startable,
		private factories: FactoryDeps,
	) {
		super();

		this.stoppingPromise = args.stoppingPromise;
	}

	public postActivate(): void { }

	public async start(onStopping?: OnStopping): Promise<void> {
		const nextState = this.factories.starting.create(
			this.host,
			{
				onStopping,
				stoppingPromise: this.stoppingPromise,
			});
		(<Friendly>this.host).state = nextState;
		nextState.postActivate();
		await this.host.start();
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
		(<Friendly>this.host).state = nextState;
		nextState.postActivate();
	}
}

export class CannotStarpDuringStopped extends Error {
	public constructor() {
		super('Cannot call .starp() during STOPPED.');
	}
}

export class CannotAssartDuringStopped extends Error {
	public constructor() {
		super('Cannot call .assart() during STOPPED.');
	}
}
