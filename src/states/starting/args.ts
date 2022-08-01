import { OnStopping } from '../../startable-like';


export interface Args<StartArgs extends unknown[]> {
	stoppingPromise: Promise<void>;
	onStopping?: OnStopping;
	startArgs: StartArgs;
}
