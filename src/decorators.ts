import { Startable } from "./startable";

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
	return (proto, name, propDesc
	) => {
		const rawStop = Reflect.get(proto, name);
		Reflect.set(proto, rawStopSym, rawStop);
	}
}
