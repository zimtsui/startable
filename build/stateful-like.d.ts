export interface StatefulLike<Snapshot> {
    capture(): Snapshot;
    restore(backup: Snapshot): void;
}
export interface RawCapture<Snapshot> {
    (): Snapshot;
}
export interface RawRestore<Snapshot> {
    (backup: Snapshot): void;
}
