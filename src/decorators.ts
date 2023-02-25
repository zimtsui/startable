import { Startable } from "./startable";
import { ReadyState } from "./startable-like";

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
			() => Promise.resolve(Reflect.get(target, rawStartSym)!()),
			() => Promise.resolve(Reflect.get(target, rawStopSym)!()),
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
