import { FriendlyStartable } from './friendly-startable';
import {
	RawStart,
	RawStop,
	StartableLike,
} from './startable-like';
import { boundMethod } from 'autobind-decorator';

export class Startable extends FriendlyStartable {
	public static create(
		rawStart: RawStart,
		rawStop: RawStop,
	): StartableLike {
		return new Startable(rawStart, rawStop);
	}

	protected constructor(
		rawStart: RawStart,
		rawStop: RawStop,
	) {
		super(rawStart, rawStop);
	}

	@boundMethod
	public starp(err?: Error): Promise<void> {
		const promise = super.starp(err);
		promise.catch(() => { });
		return promise;
	}
}
