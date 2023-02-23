import { OnStopping, RawStart, RawStop, ReadyState, StartableLike } from "./startable-like";
import { AgentLike, State } from "./state";
export declare class Startable implements StartableLike {
    private state;
    constructor(rawStart: RawStart, rawStop: RawStop);
    getReadyState(): ReadyState;
    /**
     * @throws {@link StateError}
     * @defaultValue `[ReadyState.STARTED]`
     */
    assertState(expected?: ReadyState[]): void;
    /**
     * Skip from `READY` to `STARTED`.
     */
    skart(startingError?: Error): void;
    /**
     * 	- If it's `READY` when invoked, then
     * 		1. Start.
     * 		1. Return the promise of the `STARTING` process.
     *	- Otherwise,
     *		1. Return the promise of the `STARTING` process.
     * @throws ReferenceError
     * @decorator `@catchThrow()`
     */
    start(onStopping?: OnStopping): Promise<void>;
    /**
     * 	- If it's `READY` now, then
     * 		1. Skip to `STOPPED`.
     * 	- If it's `STARTING` when invoked, then
     * 		1. Wait until `STARTED`.
     *		1. Stop.
     *		1. Return the promise of `STOPPING` process.
     * 	- If it's `STARTED` when invoked, then
     * 		1. Stop.
     *		1. Return the promise of `STOPPING` process.
     * 	- If it's `STOPPING` or `STOPPED` when invoked, then
     * 		1. Return the promise of `STOPPING` process.
     * @decorator `@boundMethod`
     * @decorator `@catchThrow()`
     */
    stop(err?: Error): Promise<void>;
    /**
     * @throws ReferenceError
     */
    getRunning(): Promise<void>;
}
export declare class Agent implements AgentLike {
    private target;
    getState: () => State;
    setState: (newState: State) => void;
    rawStart: RawStart;
    rawStop: RawStop;
    constructor(target: Startable, options: {
        getState: () => State;
        setState: (newState: State) => void;
        rawStart: RawStart;
        rawStop: RawStop;
    });
    getReadyState(): ReadyState;
    assertState(expected: ReadyState[]): void;
    skart(startingError?: Error): void;
    start(onStopping?: OnStopping): Promise<void>;
    stop(err?: Error): Promise<void>;
    getRunning(): Promise<void>;
}
