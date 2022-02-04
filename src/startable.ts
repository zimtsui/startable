import { EventEmitter } from 'events';
import { assert } from 'chai';
import { boundMethod } from 'autobind-decorator';

export const enum ReadyState {
	STARTING = 'STARTING',
	STARTED = 'STARTED',
	UNSTARTED = 'UNSTARTED',
	STOPPING = 'STOPPING',
	STOPPED = 'STOPPED',
	UNSTOPPED = 'UNSTOPPED',
}

export interface StartableLike {
	start(stopping?: OnStopping): Promise<void>;
	stop(err?: Error): Promise<void>;
}

export interface OnStopping {
	(err?: Error): void;
}

export class StopCalledDuringStarting extends Error {
	constructor() {
		super('.stop() is called during STARTING.');
	}
}

export class StartingFailedManually extends Error {
	constructor() {
		super('.failStarting() was called during STARTING.');
	}
}

export abstract class Startable extends EventEmitter implements StartableLike {
	public readyState = ReadyState.STOPPED;
	private Startable$onStoppings?: OnStopping[];
	private Startable$errorDuringStarting?: null | Error;
	private Startable$resolve?: () => void;
	private Startable$reject?: (err: Error) => void;

	public async assart(onStopping?: OnStopping): Promise<void> {
		assert(
			this.readyState === ReadyState.STARTING ||
			this.readyState === ReadyState.STARTED,
			'.assert() is allowed during only STARTING or STARTED.',
		);
		await this.start(onStopping);
	}

	protected abstract Startable$rawStart(): Promise<void>;
	private Startable$starting = Promise.resolve();
	public async start(onStopping?: OnStopping): Promise<void> {
		if (
			this.readyState === ReadyState.STOPPED ||
			this.readyState === ReadyState.UNSTOPPED
		) {
			this.readyState = ReadyState.STARTING;
			this.Startable$errorDuringStarting = null;
			this.Startable$onStoppings = [];

			// in case Startable$start() calls start() syncly
			this.Startable$starting = new Promise((resolve, reject) => {
				this.Startable$resolve = resolve;
				this.Startable$reject = reject;
			});

			try {
				await this.Startable$rawStart();
				if (this.Startable$errorDuringStarting!)
					throw this.Startable$errorDuringStarting;
				this.Startable$resolve!();
				this.readyState = ReadyState.STARTED;
			} catch (err: any) {
				this.Startable$reject!(<Error>err);
				this.readyState = ReadyState.UNSTARTED;
			}
		}
		if ((
			this.readyState === ReadyState.STARTING ||
			this.readyState === ReadyState.STARTED ||
			this.readyState === ReadyState.UNSTARTED
		) && onStopping)
			this.Startable$onStoppings!.push(onStopping);
		await this.Startable$starting;
	}

	protected abstract Startable$rawStop(err?: Error): Promise<void>;
	private Startable$stopping = Promise.resolve();
	public async tryStop(err?: Error): Promise<void> {
		if (this.readyState === ReadyState.STARTING)
			throw new StopCalledDuringStarting();
		if (
			this.readyState === ReadyState.STARTED ||
			this.readyState === ReadyState.UNSTARTED
		) {
			this.readyState = ReadyState.STOPPING;
			for (const onStopping of this.Startable$onStoppings!)
				onStopping(err);

			// in case $Startable$stop() or onStopping() calls stop() syncly
			this.Startable$stopping = new Promise((resolve, reject) => {
				this.Startable$resolve = resolve;
				this.Startable$reject = reject;
			});

			try {
				await this.Startable$rawStop(err);
				this.Startable$resolve!();
				this.readyState = ReadyState.STOPPED;
			} catch (err: unknown) {
				this.Startable$reject!(<Error>err);
				this.readyState = ReadyState.UNSTOPPED;
			}
		}
		await this.Startable$stopping;
	}

	public failStarting(): void {
		if (this.readyState !== ReadyState.STARTING) return;
		this.Startable$errorDuringStarting =
			this.Startable$errorDuringStarting! ||
			new StartingFailedManually();
	}

	private async Startable$stopUncaught(err?: Error): Promise<void> {
		if (this.readyState === ReadyState.STARTING) {
			this.failStarting();
			await this.start().catch(() => { });
		}
		await this.tryStop(err);
	}

	@boundMethod
	public stop(err?: Error): Promise<void> {
		const promise = this.Startable$stopUncaught(err);
		promise.catch(() => { });
		return promise;
	}
}
