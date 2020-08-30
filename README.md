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
5. STOPPED：从 `close` 事件发生，到对象被 runtime 回收

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

Startable 顺便还实现了以下功能

1. 如果你调用一个 Service 的 stop() 时这个 Service 正处在 STOPPING/STOPPED 状态，你的这次调用没有任何效果，并返回实际正在运行的 stop() 的函数值。

    因此你可以尽情地调用 stop() 而不需要考虑重复 stop 的问题。例如，在实现母 Service 的 _stop() 时，不需要考虑
    
    > 这次 stop 是某个子 Service 引起的，那么说明此时我的这个子 Service 他自己已经开始 stop 了，我现在把他的 stop() 和其他子 Service 的 stop() 再一起 call 一遍会不会出乱子？

    这种问题。

2. 如果你调用一个 Service 的 stop() 时这个 Service 正处在 STARTING 状态，那么这个 Service 会在 start() 结束之后立即开始 stop() ，并返回 stop() 的函数值。

3. 如果你调用一个 Service 的 stop() 时这个 Service 正处在 CONSTRUCTED 状态，那么 Service 会经过一个什么都不干的瞬间 stop 过程，直接进入 STOPPED 状态。

    Q：这个瞬间的 stop 过程会不会调用 onStopping？
    A：CUNSTRUCTED 状态下 onStopping 还没传进去呢。

4. 如果你实现的 _start() 函数 throw 了，那标志着 start 过程的失败，这个 Service 会进入 FAILED 状态。默认情况下，会自动开始 stop 过程，且 start() 返回时 stop 过程已经开始即已进入 STOPPING 状态，因此 FAILED 状态只有一瞬间。

    Startable 提供了 `started` 和 `stopped` 两个属性来查询 start 和 stop 过程何时结束，还提供了 `lifePeriod` 属性来查询当前状态。

    ```ts
        // ...
        import { LifePeriod } from 'startable';
        // ...
        service.start()
            .catch(err => {
                console.log('start() failed and stop() has been called automatically.');
                this.stopped!.then(() => {
                    console.log('but stop() succeeded.');
                    console.log(this.lifePeriod === LifePeriod.STOPPED); // true
                }, () => {
                    console.log('and stop() failed as well.');
                    console.log(this.lifePeriod === LifePeriod.BROKEN); // true
                });
            });
    ```

5. 如果你实现的 _stop() 函数 throw 了，那标志着 stop 过程的失败，这个 Service 会进入 BROKEN 状态。BROKEN 状态的 Service 不能重新 start。

    因此 Startable 扩展到 7 个状态

    1. CONSTRUCTED：未开始 start 过程的状态
    2. STARTING：start 过程
    3. STARTED：start 过程成功且未开始 stop 过程的状态，即正在提供服务中的状态
    4. FAILED：start 过程失败且还未开始 stop 过程的状态
    5. STOPPING：stop 过程
    6. STOPPED：stop 过程成功的状态
    7. BROKEN：stop 过程失败的状态