import { ManualPromise } from 'manual-promise';
export interface PublicManualPromiseLike extends Promise<void> {
    resolve(): void;
    reject(err: Error): void;
}
export declare class PublicManualPromise extends ManualPromise {
    static create(): PublicManualPromiseLike;
    resolve: () => void;
    reject: (err: Error) => void;
    protected constructor();
}
