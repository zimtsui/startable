import { FactoryDeps as StoppedDeps } from './states/stopped/factory-deps';
import { FactoryDeps as StartingDeps } from './states/starting/factory-deps';
import { FactoryDeps as StartedDeps } from './states/started/factory-deps';
import { FactoryDeps as StoppingDeps } from './states/stopping/factory-deps';
import * as Stopped from './states/stopped/factory';
import * as Starting from './states/starting/factory';
import * as Started from './states/started/factory';
import * as Stopping from './states/stopping/factory';
export declare class StateFactories<StartArgs extends unknown[]> implements StoppedDeps<StartArgs>, StartingDeps<StartArgs>, StartedDeps<StartArgs>, StoppingDeps<StartArgs> {
    stopped: Stopped.Factory<StartArgs>;
    starting: Starting.Factory<StartArgs>;
    started: Started.Factory<StartArgs>;
    stopping: Stopping.Factory<StartArgs>;
}
