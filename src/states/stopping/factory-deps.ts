import * as Stopped from '../stopped/factory-like';

export interface FactoryDeps<StartArgs extends unknown[]> {
	stopped: Stopped.FactoryLike<StartArgs>;
}
