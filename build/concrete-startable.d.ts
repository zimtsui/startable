import { Startable, RawStart, RawStop, State } from './startable';
export declare class ConcreteStartable<StartArgs extends unknown[]> extends Startable<StartArgs> {
    protected rawStart: RawStart<StartArgs>;
    protected rawStop: RawStop;
    protected state: State<StartArgs>;
    constructor(rawStart: RawStart<StartArgs>, rawStop: RawStop);
}
