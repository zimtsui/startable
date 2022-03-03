import {
	State,
	CannotSkipStart,
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
import { ManualPromise } from 'manual-promise';


export class Stopping extends State implements StateLike.Stopping {
	private readonly startingPromise: Promise<void>;
	private readonly stoppingPromise = new ManualPromise();
	private onStoppings: OnStopping[];
	private manualFailure: null | Error = null;

	constructor(
		protected readonly startable: FriendlyStartableLike,
		args: Stopping.Args,
	) {
		super(startable);

		this.startingPromise = args.startingPromise;
		this.onStoppings = args.onStoppings;

		for (const onStopping of this.onStoppings) onStopping(args.err);

		this.setup();
	}

	public getStartingPromise(): Promise<void> {
		return this.startingPromise;
	}

	public getStoppingPromise(): Promise<void> {
		return this.stoppingPromise;
	}

	private async setup(): Promise<void> {
		try {
			await this.startable.rawStop();
			if (this.manualFailure) throw this.manualFailure;
			this.stoppingPromise.resolve();
		} catch (err) {
			this.stoppingPromise.reject(<Error>err);
		}
		this.startable.state =
			this.startable.factories.stopped.create({
				stoppingPromise: this.stoppingPromise,
			});
	}

	public async tryStart(onStopping?: OnStopping): Promise<never> {
		throw new CannotTryStartDuringStopping();
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.startingPromise;
	}

	public async tryStop(err?: Error): Promise<void> {
		await this.stoppingPromise;
	}

	public async stop(err?: Error): Promise<void> {
		await this.tryStop(err);
	}

	public async fail(err: Error): Promise<void> {
		this.manualFailure = err;
		await this.stoppingPromise.catch(() => { });
	}

	public getReadyState(): ReadyState {
		return ReadyState.STOPPING;
	}

	public skipStart(onStopping?: OnStopping): never {
		throw new CannotSkipStartDuringStopping();
	}
}

export namespace Stopping {
	export import Args = FactoryLike.Stopping.Args;

	export class Factory implements FactoryLike.Stopping {
		constructor(
			protected startable: FriendlyStartableLike,
		) { }

		public create(args: Args): Stopping {
			return new Stopping(this.startable, args);
		}
	}
}

export class CannotTryStartDuringStopping extends Error {
	constructor() {
		super('Cannot call .tryStop() during STOPPING.');
	}
}

export class CannotSkipStartDuringStopping extends CannotSkipStart {
	constructor() {
		super('Cannot call .skipStart() during STOPPING.');
	}
}
