import {
	Startable,
	RawStart,
	RawStop,
	State,
} from './startable';
import { Factories } from './factories';


class constructor extends Startable {
	protected state: State;

	public constructor(
		protected rawStart: RawStart,
		protected rawStop: RawStop,
	) {
		super();

		const factories = new Factories();
		const initialState = factories.stopped.create(
			this,
			{
				stoppingPromise: Promise.resolve(),
			},
		);
		this.state = initialState;
		initialState.postActivate();
	}
}


export function create(
	rawStart: RawStart,
	rawStop: RawStop,
): Startable {
	return new constructor(
		rawStart,
		rawStop,
	);
}
