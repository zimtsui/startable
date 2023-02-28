# Startable

[![Npm package version](https://img.shields.io/npm/v/@zimtsui/startable?style=flat-square)](https://www.npmjs.com/package/@zimtsui/startable)

Startable 是一个 JavaScript 的服务生命周期管理器。初衷是为了适配阿里开源 Node.js 进程管理器 [Pandora](https://github.com/midwayjs/pandora)。

## 预备概念

- 任务/Job/Task

	任务是占有线程的有限时间复杂度算法。任务运行时间与性能有关，性能越强，运行时间越短。

	例如，批处理脚本、异步函数。

- 服务/Service/Daemon

	服务自己占有线程，有可能自己挂掉，通过事件触发的方式通知用户。服务挂掉之后如果继续访问会导致未定义的后果。

	例如 Node.js 中一个 TCP 连接，就是一个服务。他本身占有协程，如果底层连接断了，这个协程会触发事件。

- 资源/Resource

	资源自己不占线程，在内存里躺着等被任务调用。

	资源在用户视角里不会自己挂掉。例如 C 语言中一个文件描述符就是一个资源，向用户提供文件访问功能。他本身不占用线程，如果某时刻底层资源挂了，只要用户不去读这个文件描述符，用户态就永远不知道底层资源挂了。如果挂掉之后继续访问会抛出定义好的错误。

### 转换

#### 资源 -> 服务

如果一个资源可以产生多种消息，那么同时轮询这些消息需要自己实现多路复用。

- 给每一种消息开一个轮询线程
- libuv

#### 服务 -> 资源

- 信号量队列

#### 任务 -> 服务

- [Pollerloop](https://github.com/zimtsui/pollerloop)

#### 任务 -> 资源

- Generator

### 注意事项

「回调」与「事件触发」不是平行概念。回调是实现事件触发的方法，回调不止用来实现事件触发，也用来实现异步任务的结果返回。

任务和服务都占有线程，区别不在于实现，而在于语义。一个可取消的异步任务，也可以理解成一个会自动结束的服务。

JavaScript 协程是协作式调度，与抢占式调度相比的优势在于状态切换的过程具有天然事务性。抢占式切换状态需要给状态加锁。

## 服务的特征

### 服务启停的异步性

服务可以有一个异步的启动和停止过程，用户需要等待启停过程结束。

例如一个 TCP Socket 有一个异步的握手和挥手的过程。

### 服务启停的事务性

启停过程本身可能发生异常而失败比如一个 TCP Socket 连接时就没连上。

C 语言打开一个文件的过程由内核确保事务性，打开失败等于没开，打开失败后不需要关闭。而用户态服务的启动过程如果失败了，内部组件可能处于半开不开的不一致状态，因此打开失败后也必须手动关闭。

### 服务之间的依赖性

一个服务可能依赖多个其他服务，这种依赖可以是聚合也可以是组合。只有子服务全部离开启动阶段，父服务才算离开启动阶段；只要有一个子服务进入停止阶段，父服务就算进入停止阶段。

### 服务启停的自发性

服务停止过程可能自发开始。

例如比如一个 TCP Socket 可能因可能因网络中断而离开了「正常提供服务中」的状态，不得不自发开始停止过程。

## 用 EventEmitter 实现服务

EventEmitter 是 Node.js 中传统的服务实现方法。

假设有一个服务 parent，有三个子服务

- tcp
- child1
- child2

任何一个子服务挂掉之后，父服务从语义上说也进入了不可用的状态，因此也应该自己挂掉。于是你不得不这么写：

```ts
class Parent extends EventEmitter {
	private tcp = new net.Socket();
	private child1 = new Child1();
	private child2 = new Child2();

	public constructor() {
		this.tcp.on('close', () => void this.close());
		this.child1.on('closing', () => void this.close());
		this.child2.on('closing', () => void this.close());

		(async () => {
			await Promise.all([
				once(this.tcp, 'connect'),
				once(this.child1, 'open'),
				once(this.child2, 'open'),
			]);
			this.emit('open');
		})().catch(err => void this.emit('error', err));
	}

	public async close() {
		try{
			this.readyState = 'closing';
			this.emit('closing');

			this.child2.close();
			this.child1.close();
			this.tcp.end();
			await Promise.all([
				this.tcp.readyState === 'readOnly' ? once(this.tcp, 'end') : Promise.resolve<void>(),
				this.child1.readyState !== 'closed' ? once(this.child1, 'closed') : Promise.resolve<void>(),
				this.child2.readyState !== 'closed' ? once(this.child2, 'closed') : Promise.resolve<void>(),
			]);

			this.readyState = 'closed';
			this.emit('closed');
		} catch (err) {
			this.emit('error', err);
		}
	}
}
```

虽然已经不得不写得这么复杂了，但依然存在以下问题

- 假设在 parent 启动过程中，child1 比 child2 先启动好。在 child1 已启动好而 child2 还未启动好的这段间隙里，child1 挂了，child1 触发 `closing` 事件。`parent.close` 作为 child1 的 `closing` 事件的回调函数被运行。然而此时 parent 正处于启动中的状态。一个启动中的 parent 被人调用了 close，后果是未定义的。
- 假设 child2 的某个启动参数，需要从 child1 处获得。即先把 child1 启动好，访问 child1 获取 child2 的启动参数，然后用这个参数启动 child2。那么你得这么写：

	```ts
	class Parent extends EventEmitter {
		private tcp = new net.Socket();
		private child1 = new Child1();
		private child2?: Child2;

		public constructor() {
			this.tcp.on('close', () => void this.close());
			this.child1.on('closing', () => void this.close());

			(async () => {
				await Promise.all([
					once(this.tcp, 'connect'),
					once(this.child1, 'open'),
				]);

				this.child2 = new Child2(await this.child1.getParamOfChild2());
				this.child2.on('closing', () => void this.close());
				await once(this.child2, 'open');

				this.emit('open');
			})().catch(err => void this.emit('error', err));
		}

		public async close() {
		try{
			this.readyState = 'closing';
			this.emit('closing');

			if (this.child2) {
				this.child2.close();
				this.child1.close();
				this.tcp.end();
			}
			await Promise.all([
				this.tcp.readyState === 'readOnly' ? once(this.tcp, 'end') : Promise.resolve<void>(),
				this.child1.readyState !== 'closed' ? once(this.child1, 'closed') : Promise.resolve<void>(),
				this.child2.readyState !== 'closed' ? once(this.child2, 'closed') : Promise.resolve<void>(),
			]);

			this.readyState = 'closed';
			this.emit('closed');
		} catch (err) {
			this.emit('error', err);
		}
	}
	}
	```

	现在问题来了，假设 chil1 最先启动好，tcp 第二个启动好，在 child1 已启动好而 tcp 还为启动好的这个间隙里，child1 挂了。那么之后找 child1 获取 child2 的启动参数时，将访问到一个已经不可用的 child1，导致未定义的后果。


总之，使用 EventEmitter 写服务，存在数不清的启停一致性的问题。根本原因是服务内部使用的系统服务或子服务可能在 parent 生命周期的任何阶段挂掉。想要解决这些问题实现启停强一致，你不得不花费大量精力严格仔细地设计整个启停过程，代码量起码是上文的两倍，你的精力将无法集中到业务逻辑上。

于是 Startable 应运而生。Startable 是 JavaScript 的服务生命周期管理框架，有了他你就可以把心思花在业务逻辑上。当然 Startable 也可以用于启停资源，毕竟资源可以被看成永不自发停止的服务。

## Startable

将服务类用 Startable 提供的装饰器套一下，让 Startable 替你解决所有启停一致性问题，你就可以把精力全部投入业务逻辑上。

### 安装

```shell
npm install --save-peer @zimtsui/startable
```

什么是 [peer dependency](https://nodejs.org/es/blog/npm/peer-dependencies/)？

### 基本用法

Startable 将一个服务的生命周期分为以下阶段

- READY
- STARTING
- STARTED
- STOPPING
- STOPPED

使用 `$` 获取一个服务对象所对应的 Startable。这个 Startable 上有一个 start 方法和一个 stop 方法，这两个方法内部会调用你自己定义的 rawStart 方法和 rawStop 方法。

```ts
export class Service {
	@AsRawStart()
	private async rawStart() {}

	@AsRawStop()
	private async rawStop() {}

	@AssertStateAsync()
	public async someAsyncMethod() {}
}

// declare function $(service): Startable;
export async function StartService(service: Service) {
	await $(service).start();
}
export async function StopService(service: Service) {
	await $(service).stop();
}
```

Startable 会自动处理好所有启停一致性问题。例如

- 如果你在启动过程中调用了 `$(service).stop`，那么 Startable 会等你的 rawStart 运行方法结束后（无论 rawStart 成败）再调用你的 rawStop。
- 如果你在启动过程中重复调用了 `$(service).start`，那么 Startable 不会重复调用你的 rawStart，而是会直接等待正在进行这次的 rawStart 返回。
- 如果你在启停过程中调用了 `service.someAsyncMethod`，那么会抛出错误，而不会执行你定义 someAsyncMethod 代码。

### 子服务

#### 组合

```ts
class Parent {
	private child1 = new Child1();
	private child2 = new Child2();

	@AsRawStart()
	private async rawStart() {
		await $(this.child1).start($(this).stop);
		await $(this.child2).start($(this).stop);
	}

	@AsRawStop()
	private async rawStop(err?: Error) {
		await $(this.child2).stop();
		await $(this.child1).stop();
	}
}
```

`$(service).stop` 方法可以传入一个可选的 Error 参数用于表示停止原因。

`$(service).start` 方法可以传入一个 onStopping 钩子作为可选回调，用于在停止过程开始时通知外部。当停止过程开始时会在当前事件循环内调用这个 onStopping 钩子，并将你填进 `$(service).stop` 的表示停止原因的 Error 参数传递给这个 onStopping 钩子。你可以自行定义这个 Error 参数的语义，然后在 onStopping 钩子中根据 Error 参数判断停止的原因。

#### 聚合

一个 Startable 的子服务也可能是外部注入的。

```ts
class Parent {
	public constructor(
		child: Child,
	) { }

	@AsRawStart()
	private async rawStart() {
		await $(this.child).start($(this).stop);
	}
}
```

### 自发停止

当自己发生致命内部错误时，就应当调用自己的 `.stop()`，因为在语义上，此时自己已经结束了「正常提供服务中」的状态。

```ts
class Service {
	public constructor() {
		this.someComponent.on('error', $(this).stop);
	}
}
```

如果是自发停止则给 `$(service).stop` 传参，如果是从外部被动停止则不传参，这样就可以在 onStopping 钩子中根据参数是否存在来判断是不是自发停止。

```ts
const service = new Service();
function startService(){
	$(service).start(err => {
		if (err) handleRunningException(err);
		$(service).stop().catch(handleStoppingException);
	}).catch(handleStartingException);
}
function stopService() {
	$(service).stop();
}
```

## 用 Startable 写服务

现在来看看用 Startable 解决上文 EventEmitter 面临的问题有多优雅。

假设有一个服务 parent，有三个子服务

- child1
- child2
- tcp

child2 的某个启动参数，需要从 child1 处获得。即先把 child1 启动好，访问 child1 获取 child2 的启动参数，然后用这个参数启动 child2。

```ts
class Parent {
	private tcp?: net.Socket;
	private child1 = new Child1();
	private child2?: Child2;

	@AsRawStart()
	private async rawStart() {
		this.tcp = new net.Socket();
		this.tcp.on('end', () => void $(this).stop());
		await once(this.tcp, 'connect');

		await $(this.child1).start($(this).stop);

		this.child2 = new Child2(await this.child1.getParamOfChild2());
		await $(this.child2).start($(this).stop);
	}

	@AsRawStop()
	private async rawStop() {
		if (this.child2) await $(this.child2).stop();

		await $(this.child1).stop();

		if (this.tcp) {
			this.tcp.end();
			await once(this.tcp, 'end');
		}
	}
}
```

## Bad practices

```ts
class Service {
	public constructor() {
		this.someComponent.on('some fatal error', err => {
			handleRunningException(err); // don't do this.
			$(this).stop();
		});
	}
}

const service = new Service();
function startService() {
	$(service).start(() => {
		$(service).stop().catch(handleStoppingException)
	}).catch(handleStartingException);
}
function stopService() {
	$(service).stop();
}
```

这个例子的问题在于，一个 Service 中出现的一个让你不得不自发停止的致命错误，那么对这个异常的 handle 代码不应写在类定义的里面，因为这个 handle 过程在语义上不属于这个对象的职责，不是你的职责却非要越俎代庖，违反了 OOD 迪米特法则。

---

```ts
class Service {
	public constructor() {
		this.someComponent.on('some fatal error', err => {
			$(this).stop(err)
				.catch(handleStoppingException); // don't do this.
		});
	}
}
```

这个例子的问题在于，一个 Service 的自发停止过程发生异常而失败，Service 的作者决定了如何 handle 这个异常，这违反了 OOD 迪米特法则。

从语义上说，Service 自己只负责应挂尽挂，如何 handle 这个 Service 停止过程的失败是 Service 的用户的职责。

---

```ts
const service = new Service();
function startService() {
	$(service).start(err => {
		if (err) handleRunningException(err);
	}).catch(handleStartingException);
}
function stopService() {
	$(service).stop().catch(handleStoppingException); // don't do this.
}
```

这个例子的问题在于，一个 Service 的自发停止过程发生异常而失败，这个异常的 handle 代码不应写在 `stopService` 中，因为 `$(service).stop` 除了在 `stopService` 中之外还可能在很多地方被调用，不得不写很多遍。

## 协程安全

写多线程要考虑线程同步问题，一个线程内的连续代码并不一定在连续时间片中运行，他们之间可能插入了其他时间片跑着其他线程的代码。同理，写多协程也要考虑协程同步问题，一个协程内的 await 两侧的连续代码并不一定在连续的事件循环中运行，他们之间可能插入了其他事件循环跑着其他协程的代码。

Startable 内部实现无非是用 Promise 搞来搞去，必然存在协程同步问题。例如如果一个 Startable 被多个协程控制，那么在任意一个协程内

```ts
await $(service).start();
console.log($(service).getReadyState());
```

的结果不一定是 STARTED，完全有可能是 STOPPING。因为在 await 之后完全有可能被切到别的协程，而那个协程又调用了 `$(service).stop`。

因此想要确保协程安全，需要明确每一个服务的生命周期由谁控制，正如 C++/Rust 中需要明确指定一个对象的 Owner 才能确保内存安全。
