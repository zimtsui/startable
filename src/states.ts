import { ReadyState, StartingFailedManually } from './interfaces';
import { OnStopping } from './interfaces';
import { Startable } from './startable';
import { ManualPromise } from 'manual-promise';

export abstract class State {
	public abstract readyState: ReadyState;
	public abstract start(onStopping?: OnStopping): Promise<void>;
	public abstract stop(err?: Error): Promise<void>;

	constructor(
		protected ctx: Startable,
		protected setState: (state: State) => void,
	) {
		setState(this);
	}
}

export namespace State {
	export class Stopped extends State {
		public readyState = ReadyState.STOPPED;
		public stoppingPromise: Promise<void>;
		public rawStart: () => Promise<void>;
		public rawStop: () => Promise<void>;

		constructor(
			protected ctx: Startable,
			protected setState: (state: State) => void,
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
			rawStart(): Promise<void>;
			rawStop(): Promise<void>;
			stoppingPromise: Promise<void>;
		}

		export interface Args { }
	}

	export class Unstopped extends Stopped {
		public readyState = ReadyState.UNSTOPPED;
	}

	export class Starting extends State {
		public readyState = ReadyState.STARTING;
		public startingPromise = new ManualPromise();
		public rawStart: () => Promise<void>;;
		public rawStop: () => Promise<void>;
		public onStoppings: OnStopping[] = [];
		public startingIsFailedManually = false;

		constructor(
			protected ctx: Startable,
			protected setState: (state: State) => void,
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
			rawStart(): Promise<void>;
			rawStop(): Promise<void>;
		}

		export interface Args {
			onStopping?: OnStopping;
		}
	}

	export class Started extends State {
		public readyState = ReadyState.STARTED;
		public startingPromise: Promise<void>;
		public rawStart: () => Promise<void>;
		public rawStop: () => Promise<void>;
		public onStoppings: OnStopping[];

		constructor(
			protected ctx: Startable,
			protected setState: (state: State) => void,
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
		export interface Args { }

		export interface PrevState {
			rawStart(): Promise<void>;
			rawStop(): Promise<void>;
			startingPromise: Promise<void>;
			onStoppings: OnStopping[];
		}
	}

	export class Unstarted extends Started {
		public readyState = ReadyState.UNSTARTED;
	}

	export class Stopping extends State {
		public readyState = ReadyState.STOPPING;
		public startingPromise: Promise<void>;
		public stoppingPromise = new ManualPromise();
		public rawStart: () => Promise<void>;
		public rawStop: () => Promise<void>;
		public onStoppings: OnStopping[];

		constructor(
			protected ctx: Startable,
			protected setState: (state: State) => void,
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
			rawStart(): Promise<void>;
			rawStop(): Promise<void>;
			startingPromise: Promise<void>;
			onStoppings: OnStopping[];
		}

		export interface Args {
			err?: Error;
		}
	}

}
