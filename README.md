# Brief

Startable 是一个 JavaScript 服务型对象的生命周期管理框架。

# 什么是 Service

一个 Service 是一个常驻内存的程序，理想情况下他的生命周期分为 5 个阶段

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

# 用事件管理 Service 的生命周期

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

有的 Service 内部包含子 Service，只有子 Service 完成了 start 过程，母 Service 才算完成了 start 过程。

```ts
class ParentService implements EventalizedService {
    private childService: EventalizedService = new ChildService();
    public start(): void {
        this.childService.start();
        this.childService.on('STARTED', () => {
            this.emit('STARTED');
        });
    }
    public stop(): void {
        this.childService.stop();
        this.childService.on('STOPPED', () => {
            this.emit('STOPPED');
        });
    }
}
```

有的 Service 内部包含多个子 Service，只有所有子 Service 都完成了 start 过程，母 Service 才算完成了 start 过程。

```ts
class ParentService implements EventalizedService {
    private childService1: PromisifiedService = new ChildService1();
    private childService2: PromisifiedService = new ChildService2();
    private childService3: PromisifiedService = new ChildService3();
    public start(): void {
        this.childService1.start();
        this.childService1.on('STARTED', () => {
            this.childService2.start();
            this.childService2.on('STARTED', () => {
                this.childService3.start();
                this.childService3.on('STARTED', () => {
                    this.emit('STARTED');
                });
            });
        });
    }
    public stop(): void {
        this.childService3.stop();
        this.childService3.on('STOPPED', () => {
            this.childService2.stop();
            this.childService2.on('STOPPED', () => {
                this.childService1.stop();
                this.childService1.on('STOPPED', () => {
                    this.emit('STOPPED');
                });
            });
        });
    }
}
```

子 Service 之间可能并没有依赖关系，某个子 Service 并不一定非得在他依赖的另一个子 Service 完成 start 过程之后才能开始自己的 start 过程，被依赖的子 Service 也并不一定非得在依赖他的子 Service 完成 stop 过程之后才能开始自己的 stop 过程。为了让子 Service 们的 start 和 stop 过程并发执行，代码更复杂了。

```ts
class ParentService implements EventalizedService {
    private childService1: PromisifiedService = new ChildService1();
    private childService2: PromisifiedService = new ChildService2();
    private childService3: PromisifiedService = new ChildService3();
    public start(): void {
        this.childService1.start();
        this.childService2.start();
        this.childService3.start();

        let startedChildServiceCount = 0;
        this.childService1.on('STARTED', () => {
            if (++startedChildServiceCount === 3) this.emit('STARTED');
        });
        this.childService2.on('STARTED', () => {
            if (++startedChildServiceCount === 3) this.emit('STARTED');
        });
        this.childService3.on('STARTED', () => {
            if (++startedChildServiceCount === 3) this.emit('STARTED');
        });
    }
    public stop(): void {
        this.childService1.stop();
        this.childService2.stop();
        this.childService3.stop();

        let stoppedChildServiceCount = 0;
        this.childService1.on('STOPPED', () => {
            if (++stoppedChildServiceCount === 3) this.emit('STOPPED');
        });
        this.childService2.on('STOPPED', () => {
            if (++stoppedChildServiceCount === 3) this.emit('STOPPED');
        });
        this.childService3.on('STOPPED', () => {
            if (++stoppedChildServiceCount === 3) this.emit('STOPPED');
        });
    }
}
```

# 用 Promise 管理 Service 的生命周期

可以看出，用事件管理 Service 生命周期的方式在面对这种 Service 嵌套时会变得很麻烦。用 Promise 管理嵌套 Service 的生命周期更加方便

```ts
interface PromisifiedService{
    start(): Promise<void>;
    stop(): Promise<void>;
}

class ParentService implements PromisifiedService {
    private childService1: PromisifiedService = new ChildService1();
    private childService2: PromisifiedService = new ChildService2();
    private childService3: PromisifiedService = new ChildService3();

    public async start(): Promise<void> {
        await subService1.start();
        await subService2.start();
        await subService3.start();
    }
    public async stop(): Promise<void> {
        await subService3.stop();
        await subService2.stop();
        await subService1.stop();
    }
}
```

即使子 Service 间没有依赖关系也很方便

```ts
class ParentService implements PromisifiedService {
    private childService1: PromisifiedService = new ChildService1();
    private childService2: PromisifiedService = new ChildService2();
    private childService3: PromisifiedService = new ChildService3();

    public async start(): Promise<void> {
        await Promise.all([
            subService1.start(),
            subService2.start(),
            subService3.start(),
        ]);
    }
    public async stop(): Promise<void> {
        await Promise.all([
            subService1.stop(),
            subService2.stop(),
            subService3.stop(),
        ]);
    }
}
```

然而实际中的子 Service 们并非都会理想地长期运行，而是可能跑着跑着有一个就突然崩溃了。因为母 Service 的功能依赖于子 Service，子 Service unavailable 了母 Service 在逻辑上自然也 unavailable 了。所以子 Service 崩溃后需要一个渠道来通知母 Service，母 Service 收到通知后开始自己的 stop 过程，让没有崩溃的其他子 Service 优雅 stop。

可以在一个 Service 的 start() 中传入一个 callback，用来向母 Service 通知自己挂了。

```ts
interface OnStopping {
    (err?: Error): void;
}

class ParentService implements PromisifiedService {
    private childService1: PromisifiedService = new ChildService1();
    private childService2: PromisifiedService = new ChildService2();
    private childService3: PromisifiedService = new ChildService3();

    private onStopping?: OnStopping;

    public async start(onStopping?: OnStopping): Promise<void> {
        this.onStopping = onStopping;

        await subService1.start((err?: Error) => {
            /* 
                A Child informed me that he's stopping.
                Since he's unavailable, I'm unavailable as well right now.
                So I'm gonna stop myself.
            */
            this.stop(err);
        });
        await subService2.start(err => {
            this.stop(err);
        });
        await subService3.start(err => {
            this.stop(err);
        });
    }
    /*
        if err is defined, it's indicated that stop() is called by this service itself
    */
    public async stop(err?: Error): Promise<void> {
        /*
            I need to inform my parent that I'm stopping.
        */
        if (this.onStopping) this.onStopping(err);

        await subService3.stop();
        await subService2.stop();
        await subService1.stop();
    }
}
```

# Startable

用 Promise 管理 Service 的写法，逻辑上很优美，可惜代码上很麻烦。并且，实际中的 Service 并不一定只在 start 完成后正常运行中崩溃，完全有可能 start 过程本身崩溃，或者 stop 过程崩溃，这样代码就更复杂了。

于是有了本框架。Startable 类替你实现了 Service 管理，你可以把精力都花在业务逻辑上，而不是 Service 管理上。

```ts
import Startable from 'startable';

class Service extends Startable {
    protected async _start(): Promise<void> {
        // some business logic
        
        this.someComponent.on('some fatal error', err => {
            this.stop(err);
        });
    }
    protected async _stop((err?: Error)): Promise<void> {
        // some business logic
    }
}

const service = new Service();
await service.start((err?: Error) => {
    if (err) console.log('service is stopping itself');
    else console.log('service is stopped by someone');
});
await sleep(SOME_TIME);
await service.stop();
```

Startable 扩展到 6 个状态

1. STARTING：start 过程
2. STARTED：start 过程成功且未开始 stop 过程的状态，即正在提供服务中的状态
3. NSTARTED：start 过程失败且还未开始 stop 过程的状态
4. STOPPING：stop 过程
5. STOPPED：stop 过程成功的状态
6. NSTOPPED：stop 过程失败的状态

初始状态是 STOPPED。

## 特性

1.  如果你调用一个 Service 的 stop() 时这个 Service 正处在 STOPPING/STOPPED/NSTOPPED 状态，你的这次调用没有任何效果，并返回实际已经运行的 stop() 的函数值。因此你可以尽情地调用 stop() 而不需要考虑重复 stop 的问题。

    同理，如果你调用一个 Service 的 start() 时这个 Service 正处在 STARTING/STARTED/NSTARTED 状态，你的这次调用没有任何效果，并返回实际已经运行的 start() 的函数值。

2.  STARTING 状态不能 stop()，STOPPING/BROKEN 状态不能 start()，否则抛出 Ilegall 类的异常。但 STOPPED 状态可以重新 start()。

3.  源代码是用面向对象风格写的而不是函数式，所以 start/stop 等方法均没有 bound。

    ```ts
    class Service extends Startable {
        protected async _start(): Promise<void> {
            this.childService.start(this.stop); // wrong
            this.childService.start(err => this.stop(err)); // right
        }
        protected async _stop((err?: Error)): Promise<void> {
            this.childService.stop();
        }
    }
    ```

4.  stop 函数可以传入一个错误，表示 stop 的原因，这个错误会自动传入 onStopping。从语义上说，应当在自己 stop 自己时总是传入，在被从外部 stop 时总是不传入。这样就可以在 stop() 和 onStopping() 中根据参数是否存在来判断是这个 service 自己挂了还是被从外部 stop。
