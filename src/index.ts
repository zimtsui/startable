import { Startable as StartableAlias } from './startable';
import { create as createAlias } from './constructor';

export type Startable = StartableAlias;
export namespace Startable {
	export const create = createAlias;
}

export {
	ReadyState,
	OnStopping,
	RawStart,
	RawStop,
} from './startable';
export { CannotStarpDuringStopped } from './states/stopped/state'
export { StarpCalledDuringStarting, CannotSkipStartDuringStarting } from './states/starting/state';
export { CannotSkipStartDuringStarted } from './states/started/state';
export { CannotSkipStartDuringStopping } from './states/stopping/state';

export { StartableLike } from './startable-like';
