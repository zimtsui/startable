# Brief

Startable 是一个 JavaScript 服务型对象的生命周期状态管理框架。

# Service

一个 Service 是一个常驻内存的程序，理想模型中他的生命周期分为 5 个状态

1. CONSTRUCTED：未开始 start 过程的状态
2. STARTING：start 过程
3. STARTED：已完成 start 过程未开始 stop 过程的状态，即正在提供服务中的状态
4. STOPPING：stop 过程
5. STOPPED：已完成 stop 过程的状态

例如 Node.js 中一个 TCP 服务器

```ts
import { Server } from net;
const server = new Server();
```

的生命周期分为

1. CONSTRUCTED：从 `new Server()` 执行，到 `server.listen()` 执行
2. STARTING：从 `server.listen()` 执行，到 `listening` 事件发生
3. STARTED：从 `listening` 事件发生，到 `server.close()` 执行
4. STOPPING：从 `server.close()` 执行，到 `close` 事件发生
5. STOPPED：从 `close` 事件发生，到对象被引擎回收

## 用事件管理 Service 的生命周期

Node.js 中 net.Server 使用事件来管理 Service 的生命周期。形如

```ts
interface EventalizedService extends EventEmitter{
    start(): void;
    stop(): void;
}
interface DoSomethingAsyncToStartService {
    (callback: () => void): void;
}
interface DoSomethingAsyncToStopService {
    (callback: () => void): void;
}

class Service implements EventalizedService {
    public start(): void {
        doSomethingAsyncToStartService(() => {
            this.emit('STARTED');
        });
    }
    public stop(): void {
        doSomethingAsyncToStopService(() => {
            this.emit('STOPPED');
        });
    }
}
```

有的 Service 内部包含子 Service，只有儿子完成了 start 过程，爸爸才算完成了 start 过程。

```ts
class Parent implements EventalizedService {
    private child: EventalizedService;
    public start(): void {
        this.child.start();
        this.child.on('STARTED', () => {
            this.emit('STARTED');
        });
    }
    public stop(): void {
        this.child.stop();
        this.child.on('STOPPED', () => {
            this.emit('STOPPED');
        });
    }
}
```

有的 Service 内部包含多个子 Service，只有所有儿子都完成了 start 过程，爸爸才算完成了 start 过程。

```ts
class Parent implements EventalizedService {
    private child1: EventalizedService;
    private child2: EventalizedService;
    private child3: EventalizedService;
    public start(): void {
        this.child1.start();
        this.child1.on('STARTED', () => {
            this.child2.start();
            this.child2.on('STARTED', () => {
                this.child3.start();
                this.child3.on('STARTED', () => {
                    this.emit('STARTED');
                });
            });
        });
    }
    public stop(): void {
        this.child3.stop();
        this.child3.on('STOPPED', () => {
            this.child2.stop();
            this.child2.on('STOPPED', () => {
                this.child1.stop();
                this.child1.on('STOPPED', () => {
                    this.emit('STOPPED');
                });
            });
        });
    }
}
```

儿子之间可能并没有依赖关系，一个儿子并不一定非得在另一个儿子完成 start 过程之后才能开始自己的 start 过程，也并不一定非得在另一个儿子完成 stop 过程之后才能开始自己的 stop 过程。为了让儿子们的 start 和 stop 过程并发执行，代码更复杂了。

```ts
class Parent implements EventalizedService {
    private child1: EventalizedService;
    private child2: EventalizedService;
    private child3: EventalizedService;
    public start(): void {
        this.child1.start();
        this.child2.start();
        this.child3.start();

        let startedChildServiceCount = 0;
        this.child1.on('STARTED', () => {
            if (++startedChildServiceCount === 3) this.emit('STARTED');
        });
        this.child2.on('STARTED', () => {
            if (++startedChildServiceCount === 3) this.emit('STARTED');
        });
        this.child3.on('STARTED', () => {
            if (++startedChildServiceCount === 3) this.emit('STARTED');
        });
    }
    public stop(): void {
        this.child1.stop();
        this.child2.stop();
        this.child3.stop();

        let stoppedChildServiceCount = 0;
        this.child1.on('STOPPED', () => {
            if (++stoppedChildServiceCount === 3) this.emit('STOPPED');
        });
        this.child2.on('STOPPED', () => {
            if (++stoppedChildServiceCount === 3) this.emit('STOPPED');
        });
        this.child3.on('STOPPED', () => {
            if (++stoppedChildServiceCount === 3) this.emit('STOPPED');
        });
    }
}
```

## 用 Promise 管理 Service 的生命周期

可以看出，用事件管理 Service 生命周期的方式在面对这种 Service 嵌套时会变得很麻烦。用 Promise 管理嵌套 Service 的生命周期更加方便

```ts
interface PromisifiedService{
    start(): Promise<void>;
    stop(): Promise<void>;
}

class Parent implements PromisifiedService {
    private child1: PromisifiedService;
    private child2: PromisifiedService;
    private child3: PromisifiedService;

    public async start(): Promise<void> {
        await child1.start();
        await child2.start();
        await child3.start();
    }
    public async stop(): Promise<void> {
        await child3.stop();
        await child2.stop();
        await child1.stop();
    }
}
```

即使儿子之间没有依赖关系也很方便

```ts
class Parent implements PromisifiedService {
    private child1: PromisifiedService;
    private child2: PromisifiedService;
    private child3: PromisifiedService;

    public async start(): Promise<void> {
        await Promise.all([
            child1.start(),
            child2.start(),
            child3.start(),
        ]);
    }
    public async stop(): Promise<void> {
        await Promise.all([
            child1.stop(),
            child2.stop(),
            child3.stop(),
        ]);
    }
}
```

## 自析构的 Service

然而实际中的 Service 并不一定都能一直运行到你关掉他，而是可能跑着跑着有一个就突然自己把自己析构了，进入了不可用状态。原因可能有很多，比如故障崩溃了，或者他维护的一个连接被对方正常断开了，或者计划的事情做完了。

一个 Service 从开始自析构的时刻起逻辑上就不可用了，所以需要同步地通知外层。可以使用 EventEmitter 来通知。

```ts
class Service extends EventEmitter implements PromisifiedService {
    constructor() {
        super();
        this.someComponent.on('some fatal error', err => {
            this.emit('error', err);
            this.stop();
        });
    }
}

const service = new Service();
service.on('error', handle);
function start() {
    service.start();
}
function stop() {
    service.stop();
}
```

不过更方便的方法是在 start() 中传入一个回调进去，作为 stop 过程开始时的钩子。这样做与通过事件传递的区别在于，事件传递时只有自析构会触发事件，而钩子回调在自析构和被析构时都会运行。所以在给 stop() 加一个可选参数表示 stop 的原因，stop() 将这个可选参数传给钩子，钩子通过这个参数来判断是自析构还是被析构。

```ts
interface OnStopping {
    (err?: Error): void;
}

class Service implements PromisifiedService {
    private onStopping?: OnStopping;

    constructor() {
        super();
        this.someComponent.on('some fatal error', (err: InternalError) => this.stop(err));
    }

    public async start(onStopping: OnStopping): Promise<void> {
        this.onStopping = onStopping;
    }

    public async stop(err?: Error): Promise<void> {
        this.onStopping!(err);
    }
}

const service = new Service();
function start() {
    service.start(err => {
        if (err instanceof InternalError) handle(err);
    });
}
function stop() {
    service.stop(new ExternalError());
}
```

# Startable

用 Promise 管理 Service 的写法，逻辑上很优美，可惜代码上很麻烦。并且，实际中的 Service 并不一定只在 start 完成后正常运行中崩溃，完全有可能 start 过程本身崩溃，或者 stop 过程崩溃，这样代码就更复杂了。

于是有了本框架。Startable 类替你实现了 Service 管理，你可以把精力都花在业务逻辑上，而不是 Service 管理上。你只需要将 start 和 stop 过程的业务逻辑实现在 `_start()` 和 `_stop()` 两个方法中。

一个没有考虑 start/stop 过程本身失败的情况的简单例子。

```ts
import Startable from 'startable';

class Service extends Startable {
    constructor() {
        super();
        this.someComponent.on('some fatal error', (err: InternalError) => {
            this.stop(err);
        });
    }

    protected async _start(): Promise<void> {
        // business logic
    }

    protected async _stop(err?: Error): Promise<void> {
        // business logic
    }
}

const service = new Service();
function start() {
    service.start(err => {
        if (err instanceof InternalError) handle(err);
    });
}
function stop() {
    service.stop(new ExternalError());
}
```

Startable 的生命周期分为 4 个状态

1. STARTING：start 过程
2. STARTED：start 过程成功或失败，且未开始 stop 过程的状态
3. STOPPING：stop 过程
4. STOPPED：stop 过程成功或失败的状态。这是新 Startable 对象的初始状态。

四个状态顺序循环，不可跳跃。

## 特性

1.  如果你调用一个 Service 的 stop() 时这个 Service 正处在 
    
    - STARTING 状态，将会等待 start 过程结束然后开始 stop 过程，并返回 stop 过程的 Promise
    - STARTED 状态，将会同步开始 stop 过程，并返回这个过程的 Promise
    - STOPPING 状态，将会直接返回正在进行的 stop 过程的 Promise
    - STOPPED 状态，将会返回最近这次 stop 过程的 Promise
    
    因此你可以在 stop 过程中尽情地重复调用 stop() 而不需要考虑实际重复运行 stop 过程的问题。

    start() 相反同理。

    ```ts
    class Service extends Startable {
        public count = 0;
        protected async _start() {
            this.count += 1;
        }
    }
    const service = new Service();

    await Promise.all([
        service.start(),
        service.start(),
    ]);
    console.log(service.count); // 1
    ```

1.  可以通过 starting 和 stopping 属性读取最近一次 start 和 stop 过程的 Promise，正在进行的过程也属于最近的过程。例如你想在 stop 过程中获取上一次 start 过程是否成功

    ```ts
    class Service extends Startable {
        protected async _stop() {
            console.log(await this.starting.then(() => true, () => false));
        }
    }
    ```

1.  可以通过 lifePeriod 属性读取当前状态。状态的变化与 start 和 stop 过程同步，但 start 和 stop 过程与 start() 和 stop() 方法是否同步见上文。比如在 STOPPED 状态时 start() 的第一个事件循环内，状态就会由 STOPPED 变为 STARTING。

    ```ts
    import { Startable, LifePeriod } from 'startable';
    class Service extends Startable { }
    const service = new Service();

    console.log(service.LifePeriod === LifePeriod.STOPPED); // true
    service.start();
    console.log(service.LifePeriod === LifePeriod.STARTING); // true
    await service.start();
    console.log(service.LifePeriod === LifePeriod.STARTED); // true
    ```

1.  start 方法接受一个钩子回调 onStopping() 作为可选参数，这个钩子在进入 STOPPING 状态后被同步调用。

1.  stop 方法接受一个 Error 作为可选参数，表示 stop 的原因，这个 Error 会自动传入 onStopping()。你可以自行定义这个 Error 的语义，比如你可以只在自析构时传入 Error，然后在 onStopping() 中用这个参数是否存在来判断是自析构还是被析构。

1.  可以很简单地在 _start() 和 _stop() 中实现
    
    - start 失败自动 stop
    - stop 成功自动重启

    ```ts
    class Service extends Startable {
        protected async _start(): Promise<void> {
            this.start().catch(err => this.stop(err)).catch(() => { });
            // or
            this.starting.catch(err => this.stop(err)).catch(() => { });
        }
        protected async _stop((err?: Error)): Promise<void> {
            this.stop().then(err => this.start()).catch(() => { });
            // or
            this.stopping.then(err => this.start()).catch(() => { });
        }
    } 
    ```

1.  Startable 继承了一个通用版本的 EventEmitter，与 node 中的 EventEmitter 接口相同，但可以在其他环境使用。

## 简化

用 Startable 框架维护 Service，代码可以写得非常简洁优美，但前提是你理解了他的语义。

下面是一个错误的反例。主程序创建这个 Service 的实例并控制他，而这个 Service 自己在运行过程中也可能发生致命异常导致自析构。

```ts
class Service extends Startable {
    constructor() {
        super();
        this.someComponent.on('some fatal error', (err: InternalError) => {
            this.stop(err)
                .catch(handle);
        });
    }
}

const service = new Service();
function start() {
    service.start(err => {
        if (err instanceof InternalError) handle(err);
    }).catch(handle);
}
function stop() {
    service.stop(new ExternalError()).catch(handle);
}
```

这个例子的问题出在他产生了外部性。一个 Service 中出现的任何异常都不应该自己 handle，而是应该通过 throw 或 EventEmitter 或 callback 等方式向管理他的人汇报，这个例子中的管理者就是主程序。这里的自析构过程本身抛出的错误没有汇报而是自己 handle了，这就是外部性。修改后

```ts
    class Service extends Startable {
        constructor() {
            super();
            this.someComponent.on('some fatal error', (err: InternalError) => {
                this.stop(err)
-                   .catch(handle);
+                   .catch(err => this.emit('error during stopping', err));
            });
        }
    }

    const service = new Service();
+   service.on('error during stopping', handle);
    function start() {
        service.start(err => {
            if (err instanceof InternalError) handle(err);
        }).catch(handle);
    }
    function stop() {
        service.stop(new ExternalError())
            .catch(handle);
    }
```

在 onStopping() 运行中，Service 处于 STOPPING 状态，调用 stop() 或读取 stopping 属性可以获得 stop 过程返回的期值，所以不需要用 EventEmitter 来汇报给主程序，主程序可以直接在定义 onStopping() 时获取。

```ts
    class Service extends Startable {
        constructor() {
            super();
            this.someComponent.on('some fatal error', (err: InternalError) => {
                this.stop(err)
-                   .catch(err => this.emit('error during stopping', err));
+                   .catch(() => {}));
            });
        }
    }

    const service = new Service();
-   service.on('error during stopping', handle);
    function start() {
        service.start(err => {
            if (err instanceof InternalError) handle(err);
+           if (err instanceof InternalError) service.stop().catch(handle);
        }).catch(handle);
    }
    function stop() {
        service.stop(new ExternalError())
            .catch(handle);
    }
```

还可以继续简化，onStopping() 这个回调的语义是开始析构，而不是开始自析构，被动析构也会运行这个回调。所以可以将 stop 过程抛出的错误在 onStopping() 中统一 handle。

```ts
    class Service extends Startable {
        constructor() {
            super();
            this.someComponent.on('some fatal error', (err: InternalError) => {
                this.stop(err)
                    .catch(() => {}));
            });
        }
    }

    const service = new Service();
    function start() {
        service.start(err => {
            if (err instanceof InternalError) handle(err);
-           if (err instanceof InternalError) service.stop().catch(handle);
+           service.stop().catch(handle);
        }).catch(handle);
    }
    function stop() {
        service.stop(new ExternalError())
-           .catch(handle);
+           .catch(() => {});
    }
```

stop() 的可选参数表示 stop 的原因，我们可以自行定义这个参数的语义，如果我们只在自析构时传参，被析构时不传参，那么代码还能继续简化。

```ts
    class Service extends Startable {
        constructor() {
            super();
            this.someComponent.on('some fatal error', (err: InternalError) => {
                this.stop(err)
                    .catch(() => {}));
            });
        }
    }

    const service = new Service();
    function start() {
        service.start(err => {
-           if (err instanceof InternalError) handle(err);
+           if (err) handle(err);
            service.stop().catch(handle);
        }).catch(handle);
    }
    function stop() {
-       service.stop(new ExternalError())
+       service.stop()
            .catch(() => {});
    }
```

嵌套的 Service 用 Startable 写起来也很简单。注意儿子的 onStopping() 运行时，爸爸并不一定处于 STARTED 状态，也有可能处于 STARTING 或 STOPPING 状态。比如爸爸已经 start 完 child1 正在 start child2 时 child1 挂了。

```ts
class Parent extends Startable {
    private child1: Startable;
    private child2: Startable;
    private child3: Startable;

    protected async _start(): Promise<void> {
        await child1.start(err => {
            if (err) this.stop(err).catch(() => { });
        });
        await child2.start(err => {
            if (err) this.stop(err).catch(() => { });
        });
        await child3.start(err => {
            if (err) this.stop(err).catch(() => { });
        });
    }
    protected async _stop(): Promise<void> {
        await child3.stop();
        await child2.stop();
        await child1.stop();
    }
}
```

如果一个儿子不是自析构而是被爸爸析构，那么儿子的 onStopping() 运行时爸爸的状态也是 STOPPING，所以在儿子的 onStopping 中调用爸爸的 stop() 会被忽略。于是代码可以简化为

```ts
    class Parent extends Startable {
        private child1: Startable;
        private child2: Startable;
        private child3: Startable;

        protected async _start(): Promise<void> {
-           await child1.start(err => {
-               if (err) this.stop(err).catch(() => { });
-           });
-           await child1.start(err => {
-               if (err) this.stop(err).catch(() => { });
-           });
-           await child1.start(err => {
-               if (err) this.stop(err).catch(() => { });
-           });
+           await child1.start(err => void this.stop(err).catch(() => { }));
+           await child2.start(err => void this.stop(err).catch(() => { }));
+           await child3.start(err => void this.stop(err).catch(() => { }));
        }
        protected async _stop(): Promise<void> {
            await child3.stop();
            await child2.stop();
            await child1.stop();
        }
    }
```

合起来

```ts
class Parent extends Startable {
    private child1: Startable;
    private child2: Startable;
    private child3: Startable;

    constructor() {
        super();
        this.someComponent.on('some fatal error', err => {
            this.stop(err).catch(() => {}));
        });
    }

    protected async _start(): Promise<void> {
        await child1.start(err => void this.stop(err).catch(() => { }));
        await child2.start(err => void this.stop(err).catch(() => { }));
        await child3.start(err => void this.stop(err).catch(() => { }));
    }
    protected async _stop(): Promise<void> {
        await child3.stop();
        await child2.stop();
        await child1.stop();
    }
}

const service = new Parent();
function start() {
    service.start(err => {
        if (err) handle(err);
        service.stop().catch(handle);
    }).catch(handle);
}
function stop() {
    service.stop().catch(() => {});
}
```

Startable 没有绑定 start() 和 stop()，也没有关闭 unhandledRejection 事件，因此下面这个更优美的代码是错误的。

```ts
class Parent extends Startable {
    private child1: Startable;
    private child2: Startable;
    private child3: Startable;

    constructor() {
        super();
        this.someComponent.on('some fatal error', this.stop);
    }

    protected async _start(): Promise<void> {
        await child1.start(this.stop);
        await child2.start(this.stop);
        await child3.start(this.stop);
    }
    protected async _stop(): Promise<void> {
        await child3.stop();
        await child2.stop();
        await child1.stop();
    }
}

const service = new Parent();
function start() {
    service.start(err => {
        if (err) handle(err);
        service.stop().catch(handle);
    }).catch(handle);
}
function stop() {
    service.stop();
}
```

之所以不关闭 unhandledRejection 是因为与 js 未来发展方向不符，有的测试框架比如 ava 甚至强制检测 unhandledRejection 设置里都不能改。既然需要自己 catch，那么绑定也没用了。

# 协程安全

写多线程要考虑线程同步问题，一个线程内的连续代码并不一定在连续时间片中运行，他们之间可能插入了其他时间片跑着其他线程的代码。同理，写多协程也要考虑协程同步问题，一个协程内的连续代码并不一定在连续的事件循环中运行，他们之间可能插入了其他事件循环跑着其他协程的代码。

Startable 用 Promise 搞来搞去，必然存在协程同步问题。例如如果一个 Service 被多个协程控制，那么在任意一个协程内

```ts
await service.start();
console.log(service.LifePeriod);
```

的结果不一定是 STARTED，完全有可能是 STOPPING 或 STOPPED。而 Startable 的状态是成环的，搞不好甚至已经转了一圈到了下一次 STARTING 了。
