import { OnStopping } from '../../startable';
export interface Args {
    startingPromise: Promise<void>;
    onStoppings: OnStopping[];
}
