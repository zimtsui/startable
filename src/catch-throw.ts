import assert = require('assert');

export function catchThrow(newError?: Error): MethodDecorator {
	return function decorator(
		proto,
		name,
		descriptor: PropertyDescriptor,
	): PropertyDescriptor {
		assert(descriptor.value instanceof Function);
		const oldMethod = <Function>descriptor.value;

		function newMethod(this: any, ...args: any[]) {
			try {
				const p = oldMethod.apply(this, args);
				if (p instanceof Promise) {
					const q = p.catch(oldError => {
						throw newError || oldError;
					});
					q.catch(() => { });
					return q;
				}
				return p;
			} catch (oldError) {
				throw newError || oldError;
			}
		}
		return {
			value: newMethod,
		}
	}
}
