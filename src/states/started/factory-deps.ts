import * as Stopping from '../stopping/factory-like';


export interface FactoryDeps<StartArgs extends unknown[]> {
	stopping: Stopping.FactoryLike<StartArgs>;
}
