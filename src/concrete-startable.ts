import {
	Startable,
	RawStart,
	RawStop,
	State,
} from './startable';
import { StateFactories } from './state-factories';


export class ConcreteStartable extends Startable {
	protected state: State;

	public constructor(
		protected rawStart: RawStart,
		protected rawStop: RawStop,
	) {
		super();

		const stateFactories = new StateFactories();
		const initialState = stateFactories.stopped.create(
			this,
			{
				stoppingPromise: Promise.resolve(),
			},
		);
		this.state = initialState;
		initialState.postActivate();
	}
}
