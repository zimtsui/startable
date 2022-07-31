import { Startable, RawStart, RawStop, State } from './startable';
export declare class ConcreteStartable extends Startable {
    protected rawStart: RawStart;
    protected rawStop: RawStop;
    protected state: State;
    constructor(rawStart: RawStart, rawStop: RawStop);
}
