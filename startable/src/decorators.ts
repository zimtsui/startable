import { Startable } from "./startable";
import { ReadyState } from "./startable-like";
import 'reflect-metadata';

const rawStartNameSym = Symbol();
const rawStopNameSym = Symbol();
const startableSym = Symbol();

export function $(target: {}): Startable {
	if (!Reflect.hasMetadata(startableSym, target)) {
		const rawStart = Reflect.hasMetadata(rawStartNameSym, target)
			? Reflect.get(target, Reflect.getMetadata(rawStartNameSym, target)!)
			: () => { };
		const rawStop = Reflect.hasMetadata(rawStopNameSym, target)
			? Reflect.get(target, Reflect.getMetadata(rawStopNameSym, target)!)
			: () => { };
		const startable = new Startable(
			rawStart.bind(target),
			rawStop.bind(target),
		);
		Reflect.defineMetadata(startableSym, startable, target);
	}

	return Reflect.getMetadata(startableSym, target);
}

export function AsRawStart(): MethodDecorator {
	return (proto, name, propDesc) => {
		Reflect.defineMetadata(rawStartNameSym, name, proto);
	}
}

export function AsRawStop(): MethodDecorator {
	return (proto, name, propDesc) => {
		Reflect.defineMetadata(rawStopNameSym, name, proto);
	}
}

export function AssertStateAsync(
	expected: ReadyState[] = [ReadyState.STARTED],
): MethodDecorator {
	return (proto, name, propDesc): PropertyDescriptor => {
		const method = Reflect.get(proto, name) as (...args: any[]) => Promise<any>;
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
		const method = Reflect.get(proto, name) as (...args: any[]) => any;
		return {
			value: function (...args: any[]): any {
				$(this).assertState(expected);
				return method.apply(this, args);
			}
		};
	}
}
