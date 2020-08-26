import { PrimitiveStartable, Stopping } from './primitive';
declare abstract class Startable extends PrimitiveStartable {
    protected reusable: boolean;
    protected autoStopAfterFailed: boolean;
    protected startRejectedAfterStopIfFailed: boolean;
    start(stopping?: Stopping): Promise<void>;
}
export * from './primitive';
export { Startable as default, Startable, };
