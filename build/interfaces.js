"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartingFailedManually = exports.StopCalledDuringStarting = void 0;
class StopCalledDuringStarting extends Error {
    constructor() {
        super('.stop() is called during STARTING.');
    }
}
exports.StopCalledDuringStarting = StopCalledDuringStarting;
class StartingFailedManually extends Error {
    constructor() {
        super('.failStarting() was called during STARTING.');
    }
}
exports.StartingFailedManually = StartingFailedManually;
// export declare namespace Props {
// 	export interface Stopped {
// 		readyState: ReadyState.STOPPED;
// 		stoppingPromise: Promise<void>;
// 	}
// 	export interface Unstopped {
// 		readyState: ReadyState.UNSTOPPED;
// 		stoppingPromise: Promise<void>;
// 	}
// 	export interface Starting {
// 		readyState: ReadyState.STARTING;
// 		onStoppings: OnStopping[];
// 		startingIsFailedManually: boolean;
// 		startingResolve: () => void;
// 		startingReject: (err: Error) => void;
// 		startingPromise: Promise<void>;
// 	}
// 	export interface Started {
// 		readyState: ReadyState.STARTED;
// 		onStoppings: OnStopping[];
// 		startingPromise: Promise<void>;
// 	}
// 	export interface Unstarted {
// 		readyState: ReadyState.UNSTARTED;
// 		onStoppings: OnStopping[];
// 		startingPromise: Promise<void>;
// 	}
// 	export interface Stopping {
// 		readyState: ReadyState.STOPPING;
// 		onStoppings: OnStopping[];
// 		stoppingResolve: () => void;
// 		stoppingReject: (err: Error) => void;
// 		startingPromise: Promise<void>;
// 		stoppingPromise: Promise<void>;
// 	}
// }
// export type Props =
// 	Props.Stopped &
// 	Props.Unstopped &
// 	Props.Starting &
// 	Props.Started &
// 	Props.Unstarted &
// 	Props.Stopping;
//# sourceMappingURL=interfaces.js.map