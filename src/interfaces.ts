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

export interface StartableLike {
	getState(): ReadyState;
	assertState(expected: ReadyState[]): void;
	skart(startingError?: Error): void;
	start(onStopping?: OnStopping): PromiseLike<void>;
	stop(err?: Error): Promise<void>;
	getRunning(): PromiseLike<void>;
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


export interface RawStart {
	(): Promise<void>;
}
export interface RawStop {
	(err?: Error): Promise<void>;
}
