export const enum ReadyState {
	STARTING = 'STARTING',
	STARTED = 'STARTED',
	UNSTARTED = 'UNSTARTED',
	STOPPING = 'STOPPING',
	STOPPED = 'STOPPED',
	UNSTOPPED = 'UNSTOPPED',
}

export interface StartableLike {
	start(stopping?: OnStopping): Promise<void>;
	stop(err?: Error): Promise<void>;
}

export interface OnStopping {
	(err?: Error): void;
}

export class StopCalledDuringStarting extends Error {
	constructor() {
		super('.stop() is called during STARTING.');
	}
}

export class StartingFailedManually extends Error {
	constructor() {
		super('.failStarting() was called during STARTING.');
	}
}

// export declare namespace Props {
// 	export interface Stopped {
// 		readyState: ReadyState.STOPPED;
// 		stoppingPromise: Promise<void>;
// 	}

// 	export interface Unstopped {
// 		readyState: ReadyState.UNSTOPPED;
// 		stoppingPromise: Promise<void>;
// 	}

// 	export interface Starting {
// 		readyState: ReadyState.STARTING;
// 		onStoppings: OnStopping[];
// 		startingIsFailedManually: boolean;
// 		startingResolve: () => void;
// 		startingReject: (err: Error) => void;
// 		startingPromise: Promise<void>;
// 	}

// 	export interface Started {
// 		readyState: ReadyState.STARTED;
// 		onStoppings: OnStopping[];
// 		startingPromise: Promise<void>;
// 	}

// 	export interface Unstarted {
// 		readyState: ReadyState.UNSTARTED;
// 		onStoppings: OnStopping[];
// 		startingPromise: Promise<void>;
// 	}

// 	export interface Stopping {
// 		readyState: ReadyState.STOPPING;
// 		onStoppings: OnStopping[];
// 		stoppingResolve: () => void;
// 		stoppingReject: (err: Error) => void;
// 		startingPromise: Promise<void>;
// 		stoppingPromise: Promise<void>;
// 	}
// }

// export type Props =
// 	Props.Stopped &
// 	Props.Unstopped &
// 	Props.Starting &
// 	Props.Started &
// 	Props.Unstarted &
// 	Props.Stopping;
