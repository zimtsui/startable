import { Startable } from "./startable";
import { RawStart, RawStop, ReadyState } from "./startable-like";

const rawStartSym = Symbol();
const rawStopSym = Symbol();
const startableSym = Symbol();

export function $(target: {}): Startable {
	if (!Reflect.has(target, rawStartSym))
		Reflect.set(target, rawStartSym, () => { });
	if (!Reflect.has(target, rawStopSym))
		Reflect.set(target, rawStopSym, () => { });

	if (!Reflect.has(target, startableSym))
		Reflect.set(target, startableSym, new Startable(
			async (...args: any[]): Promise<any> => {
				const rawStart = Reflect.get(target, rawStartSym)!;
				return rawStart.apply(target, args);
			},
			async (...args: any[]): Promise<any> => {
				const rawStop = Reflect.get(target, rawStopSym)!;
				return rawStop.apply(target, args);
			}
		));

	return Reflect.get(target, startableSym);
}

export function AsRawStart(): MethodDecorator {
	return (proto, name, propDesc) => {
		const rawStart = Reflect.get(proto, name);
		Reflect.set(proto, rawStartSym, rawStart);
	}
}

export function AsRawStop(): MethodDecorator {
	return (proto, name, propDesc) => {
		const rawStop = Reflect.get(proto, name);
		Reflect.set(proto, rawStopSym, rawStop);
	}
}


export function AssetStateAsync(
	expected: ReadyState[] = [ReadyState.STARTED],
): MethodDecorator {
	return (proto, name, propDesc): PropertyDescriptor => {
		const method = <(...args: any[]) => Promise<any>>Reflect.get(proto, name);
		return {
			value: async function (...args: any[]): Promise<any> {
				$(this).assertState(expected);
				return await method.apply(this, args);
			}
		};
	}
}

export function AssetStateSync(
	expected: ReadyState[] = [ReadyState.STARTED],
): MethodDecorator {
	return (proto, name, propDesc): PropertyDescriptor => {
		const method = <(...args: any[]) => any>Reflect.get(proto, name);
		return {
			value: function (...args: any[]): any {
				$(this).assertState(expected);
				return method.apply(this, args);
			}
		};
	}
}
