import * as Starting from '../starting/factory-like';
import * as Started from '../started/factory-like';
export interface FactoryDeps<StartArgs extends unknown[]> {
    starting: Starting.FactoryLike<StartArgs>;
    started: Started.FactoryLike<StartArgs>;
}
