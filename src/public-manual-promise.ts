import { ManualPromise } from 'manual-promise';

export interface PublicManualPromiseLike extends Promise<void> {
	resolve(): void;
	reject(err: Error): void;
}

export class PublicManualPromise extends ManualPromise {
	public static create(): PublicManualPromiseLike {
		return new PublicManualPromise();
	}

	public resolve!: () => void;
	public reject!: (err: Error) => void;

	protected constructor() {
		super();
	}
}
