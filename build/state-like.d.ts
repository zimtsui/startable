import { StartableLike } from './startable-like';
export declare const STATE_LIKE_NOMINAL: unique symbol;
export interface StateLike extends StartableLike {
    [STATE_LIKE_NOMINAL]: void;
    postActivate(): void;
}
