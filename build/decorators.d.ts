import { Startable } from "./startable";
import { ReadyState } from "./startable-like";
export declare function $(target: {}): Startable;
export declare function AsRawStart(): MethodDecorator;
export declare function AsRawStop(): MethodDecorator;
export declare function AssetStateAsync(expected?: ReadyState[]): MethodDecorator;
export declare function AssetStateSync(expected?: ReadyState[]): MethodDecorator;
