import * as Started from '../started/factory-like';
export interface FactoryDeps<StartArgs extends unknown[]> {
    started: Started.FactoryLike<StartArgs>;
}
