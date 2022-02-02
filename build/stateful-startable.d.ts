import { Startable } from './startable';
export interface StatefulLike<Snapshot, Backup = Snapshot> {
    capture(): Snapshot;
    restore(backup: Backup): void;
}
export declare abstract class StatefulStartable<Snapshot, Backup = Snapshot> extends Startable implements StatefulLike<Snapshot, Backup> {
    protected abstract StatefulStartable$start(): Promise<void>;
    protected abstract StatefulStartable$stop(): Promise<void>;
    protected abstract StatefulStartable$capture(): Snapshot;
    protected abstract StatefulStartable$restore(backup: Backup): void;
    private StatefulStartable$restored;
    protected Startable$start(): Promise<void>;
    protected Startable$stop(): Promise<void>;
    capture(): Snapshot;
    restore(backup: Backup): void;
}
