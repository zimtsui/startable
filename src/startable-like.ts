export interface StartableLike {
	start(onStopping?: OnStopping): Promise<void>;
	stop(err?: Error): Promise<void>;
	starp(err?: Error): Promise<void>;
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
