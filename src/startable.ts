import { FriendlyStartable } from './friendly-startable';
import { BaseContainer } from '@zimtsui/injektor';
import { TYPES } from './injection/types';
import {
	RawStart,
	RawStop,
	StartableLike,
	OnStopping,
	ReadyState,
} from './startable-like';
import { boundMethod } from 'autobind-decorator';

import * as Stopped from './states/stopped/factory';
import * as Starting from './states/starting/factory';
import * as Started from './states/started/factory';
import * as Stopping from './states/stopping/factory';
import { Factories } from './factories';


export class Startable implements StartableLike {
	private friendly: FriendlyStartable;

	public constructor(
		rawStart: RawStart,
		rawStop: RawStop,
	) {
		class Container extends BaseContainer {
			public [TYPES.StoppedFactory] = this.rcs(Stopped.Factory);
			public [TYPES.StartingFactory] = this.rcs(Starting.Factory);
			public [TYPES.StartedFactory] = this.rcs(Started.Factory);
			public [TYPES.StoppingFactory] = this.rcs(Stopping.Factory);
			public [TYPES.FriendlyStartable] = this.rcs(FriendlyStartable);
			public [TYPES.Factories] = this.rcs(Factories);
			public [TYPES.RawStart] = this.rv(rawStart);
			public [TYPES.RawStop] = this.rv(rawStop);
		}
		const c = new Container();
		this.friendly = c[TYPES.FriendlyStartable]();
		const initialState = c[TYPES.StoppedFactory]().create({
			stoppingPromise: Promise.resolve(),
		});
		this.friendly.setState(initialState);
		initialState.postActivate();
	}

	public getReadyState(): ReadyState {
		return this.friendly.getReadyState();
	}

	public skipStart(onStopping?: OnStopping): void {
		this.friendly.skipStart(onStopping);
	}

	public async start(onStopping?: OnStopping): Promise<void> {
		await this.friendly.start(onStopping);
	}

	public async assart(onStopping?: OnStopping): Promise<void> {
		await this.friendly.assart(onStopping);
	}

	public async stop(err?: Error): Promise<void> {
		await this.friendly.stop(err);
	}

	@boundMethod
	public starp(err?: Error): Promise<void> {
		const promise = this.friendly.starp(err);
		promise.catch(() => { });
		return promise;
	}
}
