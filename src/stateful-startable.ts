import {
	StatefulLike,
	RawCapture,
	RawRestore,
} from './stateful-like';
import { Startable } from './startable';
import {
	ReadyState,
	RawStart,
	RawStop,
} from './startable-like';
import assert = require('assert');


export class StatefulStartable<Snapshot>
	extends Startable
	implements StatefulLike<Snapshot> {

	constructor(
		protected readonly rawStart: RawStart,
		protected readonly rawStop: RawStop,
		private readonly rawCapture: RawCapture<Snapshot>,
		private readonly rawRestore: RawRestore<Snapshot>,
	) {
		super(rawStart, rawStop);
	}

	public capture(): Snapshot {
		assert(this.getReadyState() !== ReadyState.STARTING);
		return this.rawCapture();
	}

	public restore(backup: Snapshot): void {
		assert(this.getReadyState() === ReadyState.STOPPED);
		this.rawRestore(backup);
	}
}
