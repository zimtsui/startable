import assert = require("assert");

export function catchThrow(): MethodDecorator {
	return function decorator(
		proto,
		name,
		descriptor: PropertyDescriptor,
	): PropertyDescriptor {
		const oldMethod = <(this: any, ...args: any[]) => any>Reflect.get(proto, name);
		const newMethod = function (this: any, ...args: any[]) {
			return $(oldMethod.apply(this, args));
		};
		return {
			value: newMethod,
		};
	}
}

export function $<P>(p: P): P {
	Promise.resolve(p).catch(() => { });
	return p;
}
