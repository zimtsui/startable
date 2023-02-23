import { AssertionError } from "assert";

export enum ReadyState {
	READY = 'READY',
	STARTING = 'STARTING',
	STARTED = 'STARTED',
	STOPPING = 'STOPPING',
	STOPPED = 'STOPPED',
}

export interface OnStopping {
	(err?: Error): void;
}

export interface RawStart {
	(): Promise<void>;
}
export interface RawStop {
	(err?: Error): Promise<void>;
}

export class StateError extends AssertionError {
	public constructor(
		actual: ReadyState,
		expected?: ReadyState[],
	) {
		super({
			expected,
			actual,
			operator: 'in',
		});
	}
}

export interface StartableLike {
	getReadyState(): ReadyState;
	skart(startingError?: Error): void;
	start(onStopping?: OnStopping): PromiseLike<void>;
	stop(err?: Error): Promise<void>;
}
