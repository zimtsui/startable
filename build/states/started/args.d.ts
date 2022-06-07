import { OnStopping } from '../../startable-like';
export interface Args {
    startingPromise: Promise<void>;
    onStoppings: OnStopping[];
}
