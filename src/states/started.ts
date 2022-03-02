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


export class Started extends State implements StateLike.Started {
	private readonly startingPromise: Promise<void>;
	private onStoppings: OnStopping[];

	constructor(
		protected readonly startable: FriendlyStartableLike,
		args: Started.Args,
	) {
		super(startable);

		this.startingPromise = args.startingPromise;
		this.onStoppings = args.onStoppings;
	}

	public getStartingPromise(): Promise<void> {
		return this.startingPromise;
	}

	public async tryStart(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.tryStart(onStopping);
	}

	public async tryStop(err?: Error): Promise<void> {
		const nextState: StateLike.Stopping =
			this.startable.factories.stopping.create({
				startingPromise: this.startingPromise,
				onStoppings: this.onStoppings,
				err,
			});
		this.startable.state = nextState;
		await nextState.getStoppingPromise();
	}

	public async stop(err?: Error): Promise<void> {
		await this.tryStop(err);
	}

	public async fail(err: Error): Promise<never> {
		throw new CannotFailDuringStarted();
	}

	public getReadyState(): ReadyState {
		return ReadyState.STARTED;
	}
}

export namespace Started {
	export import Args = FactoryLike.Started.Args;

	export class Factory implements FactoryLike.Started {
		constructor(
			protected startable: FriendlyStartableLike,
		) { }

		public create(args: Args): Started {
			return new Started(this.startable, args);
		}
	}
}

export class CannotFailDuringStarted extends CannotFail {
	constructor() {
		super('Cannot call .fail() during STARTED.');
	}
}
