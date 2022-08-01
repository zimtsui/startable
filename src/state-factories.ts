import { FactoryDeps as StoppedDeps } from './states/stopped/factory-deps';
import { FactoryDeps as StartingDeps } from './states/starting/factory-deps';
import { FactoryDeps as StartedDeps } from './states/started/factory-deps';
import { FactoryDeps as StoppingDeps } from './states/stopping/factory-deps';

import * as Stopped from './states/stopped/factory';
import * as Starting from './states/starting/factory';
import * as Started from './states/started/factory';
import * as Stopping from './states/stopping/factory';



export class StateFactories<StartArgs extends unknown[]> implements
	StoppedDeps<StartArgs>,
	StartingDeps<StartArgs>,
	StartedDeps<StartArgs>,
	StoppingDeps<StartArgs> {

	public stopped: Stopped.Factory<StartArgs> = new Stopped.Factory(this);
	public starting: Starting.Factory<StartArgs> = new Starting.Factory(this);
	public started: Started.Factory<StartArgs> = new Started.Factory(this);
	public stopping: Stopping.Factory<StartArgs> = new Stopping.Factory(this);
}
