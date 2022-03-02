import {
	StartableLike,
	OnStopping,
	RawStart,
	RawStop,
	ReadyState,
} from './startable-like';


export interface FriendlyStartableLike extends StartableLike {
	readonly rawStart: RawStart;
	readonly rawStop: RawStop;
	readonly factories: Factories;
	state: StateLike;
}

export interface StateLike extends StartableLike { }

export namespace StateLike {
	export interface Stopped extends StateLike {
		getStoppingPromise(): Promise<void>;
	}

	export interface Starting extends StateLike {
		getStartingPromise(): Promise<void>;
	}

	export interface Started extends StateLike {
		getStartingPromise(): Promise<void>;
	}

	export interface Stopping extends StateLike {
		getStartingPromise(): Promise<void>;
		getStoppingPromise(): Promise<void>;
	}
}

export interface Factories {
	readonly stopped: FactoryLike.Stopped;
	readonly starting: FactoryLike.Starting;
	readonly started: FactoryLike.Started;
	readonly stopping: FactoryLike.Stopping;
}

export namespace FactoryLike {
	export interface Stopped {
		create(args: Stopped.Args): StateLike.Stopped;
	}

	export namespace Stopped {
		export interface Args {
			readonly stoppingPromise: Promise<void>;
		}
	}

	export interface Starting {
		create(args: Starting.Args): StateLike.Starting;
	}

	export namespace Starting {
		export interface Args {
			readonly onStopping?: OnStopping;
		}
	}

	export interface Started {
		create(args: Started.Args): StateLike.Started;
	}

	export namespace Started {
		export interface Args {
			readonly startingPromise: Promise<void>;
			readonly onStoppings: OnStopping[];
		}
	}

	export interface Stopping {
		create(args: Stopping.Args): StateLike.Stopping;
	}

	export namespace Stopping {
		export interface Args {
			readonly startingPromise: Promise<void>;
			readonly onStoppings: OnStopping[];
			readonly err?: Error;
		}
	}
}
