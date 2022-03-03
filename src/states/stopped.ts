import {
	State,
	CannotFail,
} from '../state';
import {
	FriendlyStartableLike,
	FactoryLike,
	StateLike,
} from '../friendly-startable-like';
import {
	OnStopping,
	ReadyState,
} from '../startable-like';
import assert = require('assert');


export class Stopped extends State implements StateLike.Stopped {
	private readonly stoppingPromise: Promise<void>;

	constructor(
		protected readonly startable: FriendlyStartableLike,
		args: Stopped.Args,
	) {
		super(startable);

		this.stoppingPromise = args.stoppingPromise;
	}

	public getStoppingPromise(): Promise<void> {
		return this.stoppingPromise;
	}

	public async tryStart(onStopping?: OnStopping): Promise<void> {
		const nextState: StateLike.Starting =
			this.startable.factories.starting.create({
				onStopping,
			});
		this.startable.state = nextState;
		await nextState.getStartingPromise();
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.tryStart(onStopping);
	}

	public async tryStop(err?: Error): Promise<void> {
		await this.stoppingPromise;
	}

	public async stop(): Promise<void> {
		await this.tryStop();
	}

	public async fail(err: Error): Promise<never> {
		throw new CannotFailDuringStopped();
	}

	public getReadyState(): ReadyState {
		return ReadyState.STOPPED;
	}

	public skipStart(onStopping?: OnStopping): void {
		this.startable.state = this.startable.factories.started.create({
			startingPromise: Promise.resolve(),
			onStoppings: onStopping ? [onStopping] : [],
		});
	}
}

export namespace Stopped {
	export import Args = FactoryLike.Stopped.Args;

	export class Factory implements FactoryLike.Stopped {
		constructor(
			protected startable: FriendlyStartableLike,
		) { }

		public create(args: Args): Stopped {
			return new Stopped(this.startable, args);
		}
	}
}

export class CannotFailDuringStopped extends CannotFail {
	constructor() {
		super('Cannot call .fail() during STOPPED.');
	}
}
