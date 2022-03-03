import { StatefulLike, RawCapture, RawRestore } from './stateful-like';
import { Startable } from './startable';
import { RawStart, RawStop } from './startable-like';
export declare class StatefulStartable<Snapshot, Backup = Snapshot> extends Startable implements StatefulLike<Snapshot, Backup> {
    protected readonly rawStart: RawStart;
    protected readonly rawStop: RawStop;
    private readonly rawCapture;
    private readonly rawRestore;
    constructor(rawStart: RawStart, rawStop: RawStop, rawCapture: RawCapture<Snapshot>, rawRestore: RawRestore<Backup>);
    capture(): Snapshot;
    restore(backup: Backup): void;
}
