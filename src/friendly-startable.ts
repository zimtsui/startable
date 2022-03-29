import { inject } from 'injektor';
import {
	OnStopping,
	RawStart,
	RawStop,
	ReadyState,
	StartableLike,
} from './startable-like';


export const initialState = {};

export class FriendlyStartable implements StartableLike {
	@inject(initialState)
	private state!: StartableLike;

	public constructor(
		public rawStart: RawStart,
		public rawStop: RawStop,
	) { }

	public setState(state: StartableLike): void {
		this.state = state;
	}

	public getState(): StartableLike {
		return this.state;
	}

	public getReadyState(): ReadyState {
		return this.state.getReadyState();
	}

	public skipStart(onStopping?: OnStopping): void {
		this.state.skipStart(onStopping);
	}

	public async tryStart(onStopping?: OnStopping): Promise<void> {
		await this.state.tryStart(onStopping);
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.state.start(onStopping);
	}

	public async tryStop(err?: Error): Promise<void> {
		await this.state.tryStop(err);
	}

	public async stop(err?: Error): Promise<void> {
		await this.state.stop(err);
	}

	public async fail(err: Error): Promise<void> {
		await this.state.fail(err);
	}
}
