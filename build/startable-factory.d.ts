import { RawStart, RawStop, Startable } from './startable';
export declare function createStartable<StartArgs extends unknown[]>(rawStart: RawStart<StartArgs>, rawStop: RawStop): Startable<StartArgs>;
