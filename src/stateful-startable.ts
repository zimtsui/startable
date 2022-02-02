import { Startable, ReadyState } from './startable';
import { assert } from 'chai';

export interface StatefulLike<Snapshot, Backup = Snapshot> {
	capture(): Snapshot;
	restore(backup: Backup): void;
}

export abstract class StatefulStartable<Snapshot, Backup = Snapshot>
	extends Startable
	implements StatefulLike<Snapshot, Backup> {

	protected abstract StatefulStartable$start(): Promise<void>;
	protected abstract StatefulStartable$stop(): Promise<void>;
	protected abstract StatefulStartable$capture(): Snapshot;
	protected abstract StatefulStartable$restore(backup: Backup): void;
	private StatefulStartable$restored = false;

	protected async Startable$start() {
		if (this.StatefulStartable$restored)
			this.StatefulStartable$restored = false;
		else
			await this.StatefulStartable$start();
	}

	protected async Startable$stop() {
		await this.StatefulStartable$stop();
	}

	public capture(): Snapshot {
		assert(
			// TODO
			this.readyState === ReadyState.STOPPED ||
			this.readyState === ReadyState.STARTED
		);
		return this.StatefulStartable$capture();
	}

	public restore(backup: Backup): void {
		assert(this.readyState === ReadyState.STOPPED);
		this.StatefulStartable$restored = true;
		this.StatefulStartable$restore(backup);
	}
}
