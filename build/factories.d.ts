import { FactoryDeps as StoppedDeps } from './states/stopped/factory-deps';
import { FactoryDeps as StartingDeps } from './states/starting/factory-deps';
import { FactoryDeps as StartedDeps } from './states/started/factory-deps';
import { FactoryDeps as StoppingDeps } from './states/stopping/factory-deps';
import * as Stopped from './states/stopped/factory-like';
import * as Starting from './states/starting/factory-like';
import * as Started from './states/started/factory-like';
import * as Stopping from './states/stopping/factory-like';
export declare class Factories implements StoppedDeps, StartingDeps, StartedDeps, StoppingDeps {
    stopped: Stopped.FactoryLike;
    starting: Starting.FactoryLike;
    started: Started.FactoryLike;
    stopping: Stopping.FactoryLike;
}
