import { ReadyState, StartingFailedManually } from './interfaces';
import { OnStopping } from './interfaces';
import { Startable } from './startable';
import { ManualPromise } from 'manual-promise';

export abstract class State {
	public abstract readonly readyState: ReadyState;
	public abstract start(onStopping?: OnStopping): Promise<void>;
	public abstract stop(err?: Error): Promise<void>;

	constructor(
		protected readonly ctx: Startable,
		protected readonly setState: (state: State) => void,
	) {
		setState(this);
	}
}

export namespace State {
	export class Stopped extends State {
		public readonly readyState: ReadyState = ReadyState.STOPPED;
		public readonly stoppingPromise: Promise<void>;
		public readonly rawStart: () => Promise<void>;
		public readonly rawStop: () => Promise<void>;

		constructor(
			protected readonly ctx: Startable,
			protected readonly setState: (state: State) => void,
			prevState: Stopped.PrevState,
			args: Stopped.Args,
		) {
			super(ctx, setState);

			this.stoppingPromise = prevState.stoppingPromise;
			this.rawStart = prevState.rawStart;
			this.rawStop = prevState.rawStop;
		}

		public async start(onStopping?: OnStopping): Promise<void> {
			const nextState = new Starting(
				this.ctx, this.setState, this, { onStopping },
			);
			await nextState.startingPromise;
		}

		public async stop(): Promise<void> {
			await this.stoppingPromise;
		}
	}

	export namespace Stopped {
		export interface PrevState {
			readonly rawStart: () => Promise<void>;
			readonly rawStop: () => Promise<void>;
			readonly stoppingPromise: Promise<void>;
		}

		export interface Args { }
	}

	export class Unstopped extends Stopped {
		public readonly readyState: ReadyState = ReadyState.UNSTOPPED;
	}

	export class Starting extends State {
		public readonly readyState: ReadyState = ReadyState.STARTING;
		public readonly startingPromise = new ManualPromise();
		public readonly rawStart: () => Promise<void>;
		public readonly rawStop: () => Promise<void>;
		public onStoppings: OnStopping[] = [];
		public startingIsFailedManually = false;

		constructor(
			protected readonly ctx: Startable,
			protected readonly setState: (state: State) => void,
			prevState: Starting.PrevState,
			args: Starting.Args,
		) {
			super(ctx, setState);

			this.rawStart = prevState.rawStart;
			this.rawStop = prevState.rawStop;

			if (args.onStopping) this.onStoppings.push(args.onStopping);

			// https://github.com/microsoft/TypeScript/issues/38929
			this.setup();
		}

		private async setup(): Promise<void> {
			try {
				await this.rawStart();
				if (this.startingIsFailedManually)
					throw new StartingFailedManually();
				this.startingPromise.resolve();
				new Started(this.ctx, this.setState, this, {});
			} catch (err) {
				this.startingPromise.reject(<Error>err);
				new Unstarted(this.ctx, this.setState, this, {});
			}
		}

		public async start(onStopping?: OnStopping): Promise<void> {
			if (onStopping) this.onStoppings.push(onStopping);
			await this.startingPromise;
		}

		public async stop(err?: Error): Promise<void> {
			this.startingIsFailedManually = true;
			await this.startingPromise.catch(() => { });
			await this.ctx.stop(err);
		}
	}

	export namespace Starting {
		export interface PrevState {
			readonly rawStart: () => Promise<void>;
			readonly rawStop: () => Promise<void>;
		}

		export interface Args {
			readonly onStopping?: OnStopping;
		}
	}

	export class Started extends State {
		public readonly readyState: ReadyState = ReadyState.STARTED;
		public readonly startingPromise: Promise<void>;
		public readonly rawStart: () => Promise<void>;
		public readonly rawStop: () => Promise<void>;
		public onStoppings: OnStopping[];

		constructor(
			protected readonly ctx: Startable,
			protected readonly setState: (state: State) => void,
			prevState: Started.PrevState,
			args: Started.Args,
		) {
			super(ctx, setState);

			this.rawStart = prevState.rawStart;
			this.rawStop = prevState.rawStop;
			this.startingPromise = prevState.startingPromise;
			this.onStoppings = prevState.onStoppings;
		}

		public async start(onStopping?: OnStopping): Promise<void> {
			if (onStopping) this.onStoppings.push(onStopping);
			await this.startingPromise;
		}

		public async stop(err?: Error): Promise<void> {
			const nextState = new Stopping(
				this.ctx, this.setState, this, { err },
			);
			await nextState.stop(err);
		}
	}

	export namespace Started {
		export interface PrevState {
			readonly rawStart: () => Promise<void>;
			readonly rawStop: () => Promise<void>;
			readonly startingPromise: Promise<void>;
			readonly onStoppings: OnStopping[];
		}

		export interface Args { }
	}

	export class Unstarted extends Started {
		public readonly readyState: ReadyState = ReadyState.UNSTARTED;
	}

	export class Stopping extends State {
		public readonly readyState: ReadyState = ReadyState.STOPPING;
		public readonly startingPromise: Promise<void>;
		public readonly stoppingPromise = new ManualPromise();
		public readonly rawStart: () => Promise<void>;
		public readonly rawStop: () => Promise<void>;
		public onStoppings: OnStopping[];

		constructor(
			protected readonly ctx: Startable,
			protected readonly setState: (state: State) => void,
			prevState: Stopping.PrevState,
			args: Stopping.Args,
		) {
			super(ctx, setState);

			this.rawStart = prevState.rawStart;
			this.rawStop = prevState.rawStop;
			this.startingPromise = prevState.startingPromise;
			this.onStoppings = prevState.onStoppings;

			for (const onStopping of this.onStoppings) onStopping(args.err);

			this.setup();
		}

		private async setup(): Promise<void> {
			try {
				await this.rawStop();
				this.stoppingPromise.resolve();
				new Stopped(this.ctx, this.setState, this, {});
			} catch (err) {
				this.stoppingPromise.reject(<Error>err);
				new Unstopped(this.ctx, this.setState, this, {});
			}
		}

		public async start(onStopping?: OnStopping): Promise<void> {
			await this.startingPromise;
		}

		public async stop(err?: Error): Promise<void> {
			await this.stoppingPromise;
		}
	}

	export namespace Stopping {
		export interface PrevState {
			readonly rawStart: () => Promise<void>;
			readonly rawStop: () => Promise<void>;
			readonly startingPromise: Promise<void>;
			readonly onStoppings: OnStopping[];
		}

		export interface Args {
			readonly err?: Error;
		}
	}
}
