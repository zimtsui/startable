import { Startable } from "./startable";
import { ReadyState } from "./startable-like";
export declare function $(target: {}): Startable;
export declare function AsRawStart(): MethodDecorator;
export declare function AsRawStop(): MethodDecorator;
export declare function AssertStateAsync(expected?: ReadyState[]): MethodDecorator;
export declare function AssertStateSync(expected?: ReadyState[]): MethodDecorator;
