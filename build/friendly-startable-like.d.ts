import { StartableLike, RawStart, RawStop } from './startable-like';
import { StateLike } from './state-like';
export interface FriendlyStartableLike<FactoryDeps> extends StartableLike {
    setState(state: StateLike): void;
    getState(): StateLike;
    rawStart: RawStart;
    rawStop: RawStop;
    factories: FactoryDeps;
}
export declare const FriendlyStartableLike: {};
