import { OnStopping } from '../../startable-like';
export interface Args {
    stoppingPromise: Promise<void>;
    onStopping?: OnStopping;
}
