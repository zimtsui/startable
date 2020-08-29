import { PrimitiveStartable, OnStopping } from './primitive';
declare abstract class Startable extends PrimitiveStartable {
    protected reusable: boolean;
    protected autoStopAfterFailed: boolean;
    protected startRejectedAfterStopIfFailed: boolean;
    start(onStopping?: OnStopping): Promise<void>;
}
export * from './primitive';
export { Startable as default, Startable, };
