import {
	RawStart,
	RawStop,
	Startable,
} from './startable';
import { ConcreteStartable } from './concrete-startable';


class StartableFactory {
	public create(
		rawStart: RawStart,
		rawStop: RawStop,
	): Startable {
		return new ConcreteStartable(
			rawStart,
			rawStop,
		);
	}
}

const startableFactory = new StartableFactory();
export function createStartable(
	rawStart: RawStart,
	rawStop: RawStop,
): Startable {
	return startableFactory.create(
		rawStart,
		rawStop,
	);
}
