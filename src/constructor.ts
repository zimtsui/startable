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

// 不能单独导出一个类的多态构造函数，所以只能工厂函数
export function create(
	rawStart: RawStart,
	rawStop: RawStop,
): Startable {
	return new constructor(
		rawStart,
		rawStop,
	);
}
