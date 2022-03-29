export interface StartableLike {
	tryStart(onStopping?: OnStopping): Promise<void>;
	tryStop(err?: Error): Promise<void>;
	fail(err: Error): Promise<void>;
	start(onStopping?: OnStopping): Promise<void>;
	stop(err?: Error): Promise<void>;
	getReadyState(): ReadyState;
	skipStart(onStopping?: OnStopping): void;
}
export const StartableLike = {};

export const enum ReadyState {
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
	(): Promise<void>;
}

export class CannotFail extends Error { }
export class CannotSkipStart extends Error { }
