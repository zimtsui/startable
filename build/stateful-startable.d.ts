import { StatefulLike, RawCapture, RawRestore } from './stateful-like';
import { Startable } from './startable';
import { RawStart, RawStop } from './startable-like';
export declare class StatefulStartable<Snapshot> extends Startable implements StatefulLike<Snapshot> {
    protected readonly rawStart: RawStart;
    protected readonly rawStop: RawStop;
    private readonly rawCapture;
    private readonly rawRestore;
    constructor(rawStart: RawStart, rawStop: RawStop, rawCapture: RawCapture<Snapshot>, rawRestore: RawRestore<Snapshot>);
    capture(): Snapshot;
    restore(backup: Snapshot): void;
}
