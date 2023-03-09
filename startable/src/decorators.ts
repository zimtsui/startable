import { Startable } from "./startable";
import { ReadyState } from "./startable-like";

const rawStartName = Symbol();
const rawStopName = Symbol();
const startableSym = Symbol();

export function $(target: {}): Startable {
	if (!Reflect.has(target, startableSym)) {
		const rawStart = Reflect.has(target, rawStartName)
			? Reflect.get(target, Reflect.get(target, rawStartName)!)
			: () => { };
		const rawStop = Reflect.has(target, rawStopName)
			? Reflect.get(target, Reflect.get(target, rawStopName)!)
			: () => { };

		Reflect.set(target, startableSym, new Startable(
			async (...args: any[]): Promise<any> => {
				return rawStart.apply(target, args);
			},
			async (...args: any[]): Promise<any> => {
				return rawStop.apply(target, args);
			}
		));
	}

	return Reflect.get(target, startableSym);
}

export function AsRawStart(): MethodDecorator {
	return (proto, name, propDesc) => {
		Reflect.set(proto, rawStartName, name);
	}
}

export function AsRawStop(): MethodDecorator {
	return (proto, name, propDesc) => {
		Reflect.set(proto, rawStopName, name);
	}
}


export function AssertStateAsync(
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

export function AssertStateSync(
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
