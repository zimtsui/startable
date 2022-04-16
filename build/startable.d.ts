import { FriendlyStartable } from './friendly-startable';
import { RawStart, RawStop, StartableLike } from './startable-like';
export declare class Startable extends FriendlyStartable {
    static create(rawStart: RawStart, rawStop: RawStop): StartableLike;
    protected constructor(rawStart: RawStart, rawStop: RawStop);
    starp(err?: Error): Promise<void>;
}
