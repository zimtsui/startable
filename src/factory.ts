import {
	RawStart,
	RawStop,
	Startable,
	State,
	Friendly,
} from './startable';
import { Ready } from './states';


/**
 * @sealed
 */
class ReadyStartable extends Startable {
	protected state: State;

	public constructor(
		protected rawStart: RawStart,
		protected rawStop: RawStop,
	) {
		super();

		this.state = new Ready(
			<Friendly><Startable>this,
			{},
		);
		this.state.postActivate();
	}
}

export function createStartable(
	rawStart: RawStart,
	rawStop: RawStop,
): Startable {
	return new ReadyStartable(
		rawStart,
		rawStop,
	);
}
