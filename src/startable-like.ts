export interface StartableLike {
	getReadyState: () => ReadyState;
	skipStart: (onStopping?: OnStopping) => void;
	start: (onStopping?: OnStopping) => Promise<void>;
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
