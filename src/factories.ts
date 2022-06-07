import { TYPES } from './injection/types';
import { instantInject } from '@zimtsui/injektor';


import { FactoryDeps as StoppedDeps } from './states/stopped/factory-deps';
import { FactoryDeps as StartingDeps } from './states/starting/factory-deps';
import { FactoryDeps as StartedDeps } from './states/started/factory-deps';
import { FactoryDeps as StoppingDeps } from './states/stopping/factory-deps';

import * as Stopped from './states/stopped/factory-like';
import * as Starting from './states/starting/factory-like';
import * as Started from './states/started/factory-like';
import * as Stopping from './states/stopping/factory-like';



export class Factories implements
	StoppedDeps,
	StartingDeps,
	StartedDeps,
	StoppingDeps {

	@instantInject(TYPES.StoppedFactory)
	public stopped!: Stopped.FactoryLike;
	@instantInject(TYPES.StartingFactory)
	public starting!: Starting.FactoryLike;
	@instantInject(TYPES.StartedFactory)
	public started!: Started.FactoryLike;
	@instantInject(TYPES.StoppingFactory)
	public stopping!: Stopping.FactoryLike;
}
