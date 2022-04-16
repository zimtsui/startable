import { StartableLike } from './startable-like';

export declare const STATE_LIKE_TYPE: unique symbol;

export interface StateLike extends StartableLike {
	[STATE_LIKE_TYPE]: void;
}
