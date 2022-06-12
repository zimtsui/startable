import { OnStopping } from '../../startable';


export interface Args {
	stoppingPromise: Promise<void>;
	onStopping?: OnStopping;
}
