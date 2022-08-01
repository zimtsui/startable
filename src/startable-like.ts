export interface StartableLike<StartArgs extends unknown[]> {
	getReadyState: () => ReadyState;
	skipStart: (onStopping?: OnStopping) => void;
	start: (args: StartArgs, onStopping?: OnStopping) => Promise<void>;
	assart: (onStopping?: OnStopping) => Promise<void>;
	stop: (err?: Error) => Promise<void>;
	starp: (err?: Error) => Promise<void>;
}

export const enum ReadyState {
	STARTING = 'STARTING',
	STARTED = 'STARTED',
	STOPPING = 'STOPPING',
	STOPPED = 'STOPPED',
}

export interface OnStopping {
	(err?: Error): void;
}
