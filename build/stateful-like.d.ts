export interface StatefulLike<Snapshot, Backup = Snapshot> {
    capture(): Snapshot;
    restore(backup: Backup): void;
}
export interface RawCapture<Snapshot> {
    (): Snapshot;
}
export interface RawRestore<Backup> {
    (backup: Backup): void;
}
