import { ManualPromise } from '@zimtsui/manual-promise';
export declare class PublicManualPromise extends ManualPromise<void> {
    resolve: () => void;
    reject: (err: Error) => void;
}
