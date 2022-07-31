import { FactoryDeps as StoppedDeps } from './states/stopped/factory-deps';
import { FactoryDeps as StartingDeps } from './states/starting/factory-deps';
import { FactoryDeps as StartedDeps } from './states/started/factory-deps';
import { FactoryDeps as StoppingDeps } from './states/stopping/factory-deps';

import * as Stopped from './states/stopped/factory';
import * as Starting from './states/starting/factory';
import * as Started from './states/started/factory';
import * as Stopping from './states/stopping/factory';



export class StateFactories implements
	StoppedDeps,
	StartingDeps,
	StartedDeps,
	StoppingDeps {

	public stopped: Stopped.Factory = new Stopped.Factory(this);
	public starting: Starting.Factory = new Starting.Factory(this);
	public started: Started.Factory = new Started.Factory(this);
	public stopping: Stopping.Factory = new Stopping.Factory(this);
}
