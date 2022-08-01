import {
	Startable,
	RawStart,
	RawStop,
	State,
} from './startable';
import { StateFactories } from './state-factories';


export class ConcreteStartable<StartArgs extends unknown[]>
	extends Startable<StartArgs> {
	protected state: State<StartArgs>;

	public constructor(
		protected rawStart: RawStart<StartArgs>,
		protected rawStop: RawStop,
	) {
		super();

		const stateFactories = new StateFactories<StartArgs>();
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
