import {
	ReadyState,
	OnStopping,
} from './startable';

export interface StartableLike {
	getReadyState: () => ReadyState;
	skipStart: (onStopping?: OnStopping) => void;
	start: (onStopping?: OnStopping) => Promise<void>;
	assart: (onStopping?: OnStopping) => Promise<void>;
	stop: (err?: Error) => Promise<void>;
	starp: (err?: Error) => Promise<void>;
}
