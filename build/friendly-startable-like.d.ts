import { StartableLike, RawStart, RawStop } from './startable-like';
import { StateLike } from './state-like';
export interface FriendlyStartableLike extends StartableLike {
    setState(state: StateLike): void;
    getState(): StateLike;
    rawStart: RawStart;
    rawStop: RawStop;
}
export declare const FriendlyStartableLike: {};
