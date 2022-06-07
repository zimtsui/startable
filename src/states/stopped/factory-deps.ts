import * as Starting from '../starting/factory-like';
import * as Started from '../started/factory-like';


export interface FactoryDeps {
	starting: Starting.FactoryLike;
	started: Started.FactoryLike;
}
