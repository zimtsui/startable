import { Startable, ReadyState } from './startable';
import { assert } from 'chai';

export interface StatefulLike<Snapshot, Backup = Snapshot> {
	capture(): Snapshot;
	restore(backup: Backup): void;
}

export abstract class StatefulStartable<Snapshot, Backup = Snapshot>
	extends Startable
	implements StatefulLike<Snapshot, Backup> {

	protected abstract StatefulStartable$rawStart(): Promise<void>;
	protected abstract StatefulStartable$rawStop(): Promise<void>;
	protected abstract StatefulStartable$rawCapture(): Snapshot;
	protected abstract StatefulStartable$rawRestore(backup: Backup): void;
	private StatefulStartable$restored?: boolean = false;

	protected async Startable$start() {
		/*
			the type is boolean or undefined,
			so "=== false" is preferred than "!"
		*/
		if (this.StatefulStartable$restored === false) {
			this.StatefulStartable$restored = undefined;
			await this.StatefulStartable$rawStart();
		} else this.StatefulStartable$restored = undefined;
	}

	protected async Startable$stop() {
		await this.StatefulStartable$rawStop();
		this.StatefulStartable$restored = false;
	}

	public capture(): Snapshot {
		return this.StatefulStartable$rawCapture();
	}

	public restore(backup: Backup): void {
		assert(this.readyState === ReadyState.STOPPED);
		this.StatefulStartable$restored = true;
		this.StatefulStartable$rawRestore(backup);
	}
}
