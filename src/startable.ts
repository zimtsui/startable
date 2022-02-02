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
		super('.stop() is called during STARTING. The ongoing start() will fail.');
	}
}

export abstract class Startable extends EventEmitter implements StartableLike {
	public readyState = ReadyState.STOPPED;
	private Startable$onStoppings: OnStopping[] = [];
	private Startable$errorDuringStarting?: null | Error;
	private Startable$resolve?: () => void;
	private Startable$reject?: (err: Error) => void;

	private async Startable$assartUncaught(onStopping?: OnStopping): Promise<void> {
		assert(
			this.readyState === ReadyState.STARTING ||
			this.readyState === ReadyState.STARTED,
			'.assert() is allowed during only STARTING or STARTED.',
		);
		await this.start(onStopping);
	}

	@boundMethod
	public assart(onStopping?: OnStopping): Promise<void> {
		const promise = this.Startable$assartUncaught(onStopping);
		promise.catch(() => { });
		return promise;
	}

	protected abstract Startable$rawStart(): Promise<void>;
	private Startable$starting = Promise.resolve();
	private async Startable$startUncaught(onStopping?: OnStopping): Promise<void> {
		if (
			this.readyState === ReadyState.STOPPED ||
			this.readyState === ReadyState.UNSTOPPED
		) {
			this.readyState = ReadyState.STARTING;
			this.Startable$errorDuringStarting = null;
			this.Startable$onStoppings = onStopping ? [onStopping] : [];

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
		} else if (this.readyState !== ReadyState.STOPPING && onStopping)
			this.Startable$onStoppings.push(onStopping);
		await this.Startable$starting;
	}

	@boundMethod
	public start(onStopping?: OnStopping) {
		const promise = this.Startable$startUncaught(onStopping);
		promise.catch(() => { });
		return promise;
	}

	protected abstract Startable$rawStop(err?: Error): Promise<void>;
	private Startable$stopping = Promise.resolve();
	/*
		stop() 不能是 async，否则 stop() 的返回值和 this.Startable$stopping 不是
		同一个 Promise 对象，stop() 的值如果外部没有 catch 就会抛到全局空间去。
	*/
	private async Startable$tryStopUncaught(err?: Error): Promise<void> {
		if (this.readyState === ReadyState.STARTING) {
			this.Startable$errorDuringStarting =
				err ||
				this.Startable$errorDuringStarting! ||
				new StopCalledDuringStarting();
			throw new StopCalledDuringStarting();
		}
		if (
			this.readyState === ReadyState.STARTED ||
			this.readyState === ReadyState.UNSTARTED
		) {
			this.readyState = ReadyState.STOPPING;
			for (const onStopping of this.Startable$onStoppings)
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

	@boundMethod
	public tryStop(err?: Error) {
		const promise = this.Startable$tryStopUncaught(err);
		promise.catch(() => { });
		return promise;
	}

	private async Startable$stopUncaught(err?: Error): Promise<void> {
		try {
			await this.tryStop(err);
		} catch (errDuringStopping: unknown) {
			if (<Error>errDuringStopping instanceof StopCalledDuringStarting) {
				await this.start().catch(() => { });
				await this.tryStop(err);
			} else throw <Error>errDuringStopping;
		}
	}

	@boundMethod
	public stop(err?: Error): Promise<void> {
		const promise = this.Startable$stopUncaught(err);
		promise.catch(() => { });
		return promise;
	}
}
