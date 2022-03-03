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


export class Starting extends State implements StateLike.Starting {
	private readonly startingPromise = new ManualPromise();
	private onStoppings: OnStopping[] = [];
	private manualFailure: null | Error = null;

	constructor(
		protected readonly startable: FriendlyStartableLike,
		args: Starting.Args,
	) {
		super(startable);

		if (args.onStopping) this.onStoppings.push(args.onStopping);

		// https://github.com/microsoft/TypeScript/issues/38929
		this.setup();
	}

	public getStartingPromise(): Promise<void> {
		return this.startingPromise;
	}

	private async setup(): Promise<void> {
		try {
			await this.startable.rawStart();
			if (this.manualFailure) throw this.manualFailure;
			this.startingPromise.resolve();
		} catch (err) {
			this.startingPromise.reject(<Error>err);
		}
		this.startable.state =
			this.startable.factories.started.create({
				onStoppings: this.onStoppings,
				startingPromise: this.startingPromise,
			});
	}

	public async tryStart(onStopping?: OnStopping): Promise<void> {
		if (onStopping) this.onStoppings.push(onStopping);
		await this.startingPromise;
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.tryStart(onStopping);
	}

	public async tryStop(err?: Error): Promise<never> {
		throw new CannotTryStopDuringStarting();
	}

	public async stop(err?: Error): Promise<void> {
		this.fail(new StopCalledDuringStarting());
		await this.startingPromise.catch(() => { });
		await this.startable.stop(err);
	}

	public async fail(err: Error): Promise<void> {
		this.manualFailure = err;
		await this.startingPromise.catch(() => { });
	}

	public getReadyState(): ReadyState {
		return ReadyState.STARTING;
	}

	public skipStart(onStopping?: OnStopping): never {
		throw new CannotSkipStartDuringStarting();
	}
}

export namespace Starting {
	export import Args = FactoryLike.Starting.Args;

	export class Factory implements FactoryLike.Starting {
		constructor(
			protected startable: FriendlyStartableLike,
		) { }

		public create(args: Args): Starting {
			return new Starting(this.startable, args);
		}
	}
}

export class StopCalledDuringStarting extends Error {
	constructor() {
		super('.stop() is called during STARTING.');
	}
}

export class CannotTryStopDuringStarting extends Error {
	constructor() {
		super('Cannot call .tryStop() during STARTING.');
	}
}
export class CannotSkipStartDuringStarting extends CannotSkipStart {
	constructor() {
		super('Cannot call .skipStart() during STARTING.');
	}
}
