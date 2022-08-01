import {
	RawStart,
	RawStop,
	Startable,
} from './startable';
import { ConcreteStartable } from './concrete-startable';


class StartableFactory<StartArgs extends unknown[]> {
	public create(
		rawStart: RawStart<StartArgs>,
		rawStop: RawStop,
	): Startable<StartArgs> {
		return new ConcreteStartable(
			rawStart,
			rawStop,
		);
	}
}

export function createStartable<StartArgs extends unknown[]>(
	rawStart: RawStart<StartArgs>,
	rawStop: RawStop,
): Startable<StartArgs> {
	const startableFactory = new StartableFactory<StartArgs>();
	return startableFactory.create(
		rawStart,
		rawStop,
	);
}
