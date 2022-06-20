# Startable

Startable 是一个 JavaScript 的后台对象框架。初衷是为了适配阿里开源 Node.js 进程管理器 [Pandora](https://github.com/midwayjs/pandora)。

## 什么是后台对象

一个 [Buffer](https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_class_buffer)，你不去访问他，他就一致保持静态什么也不干。当你运行他的方法时，他才活动。这样的响应式的对象就是前台对象。

一个 [TCP Socket](https://nodejs.org/dist/latest-v14.x/docs/api/net.html#net_class_net_socket)，你不去访问他，他也会在后台运行一个服务例程来接收对面发来的数据。这样的对象就是后台对象。

后台对象通常有以下特点

- 后台对象有一个异步的启动和停止过程

    比如一个 TCP Socket 有一个异步的握手和挥手的过程。

- 停止过程可能自发开始

    比如一个 TCP Socket 可能因可能因网络中断而离开了「正常提供服务中」的状态，不得不自发开始停止过程。

- 启停过程本身也可能发生异常而失败

    比如一个 TCP Socket 连接时就没连上。

## Startable 类

将你要定义的后台类组合 Startable，然后将异步的启停过程实现在 `.rawStart()` 和 `.rawStop()` 中。

```ts
class Daemon implements StartableLike {
    protected async rawStart(): Promise<void> { }
    protected async rawStop(): Promise<void> { }
    private startable = new Startable(
        () => this.rawStart(),
        () => this.rawStop(),
    );
    public start = this.startable.start;
    public stop = this.startable.stop;
    public assart = this.startable.assart;
    public starp = this.startable.starp;
    public getReadyState = this.startable.getReadyState;
    public skipStart = this.startable.skipStart;
}

const daemon = new Daemon();
await daemon.start();
await daemon.stop();
```

## 状态循环

一个 Startable 对象的生命周期有 4 个状态，依次循环不可跳跃

1. 一个 Startable 刚 new 出来时是 STOPPED 状态。
1. 此时运行异步的 `.start()` 进入 STARTING 状态，Startable 会调用你实现的 `.rawStart`。
1. `.rawStart` 结束时，进入 STARTED 状态，也就是「正常提供服务中」的状态。
1. 此时运行异步的 `.stop()` 进入 STOPPING 状态，Startable 会调用你实现的 `.rawStop`。
1. `.rawStop` 结束时，进入 STOPPED 状态。

### 查看当前时刻的状态。

```ts
console.log(daemon.getReadyState() === ReadyState.STOPPED);
```

## 启停方法

### 启动方法

| 状态 | `.start()` 的行为 | `.start()` 的值 |
|---|---|---|
| STOPPED | 开始启动过程 | 本次启动过程的 Promise |
| STARTING | 什么也不干 | 正在进行的这次启动过程的 Promise |
| STARTED | 什么也不干 | 刚刚结束的那次启动过程的 Promise |
| STOPPING | 什么也不干 | 上一次启动过程的 Promise |

- 你可以在启动过程中尽情地重复运行 `.start()` ，而不用担心重复运行你的 `.rawStart` 实现。
- 在停止过程中可以查看上一次启动是否成功

    ```ts
    class Daemon implements StartableLike {
        protected async rawStop() {
            console.log(
                await this.start()
                    .then(() => true, () => false),
            );
        }
    }
    ```

### 停止方法

| 状态 | `.stop()` 的行为 | `.stop()` 的值 |
|---|---|---|
| STOPPED | 什么也不干 | 刚刚结束的这次停止过程的 Promise |
| STARTING | 什么也不干 | 上一次停止过程的 Promise |
| STARTED | 开始停止过程 | 本次停止过程的 Promise |
| STOPPING | 什么也不干 | 正在进行的这次停止过程的 Promise |

- 你可以在停止过程中尽情地重复运行 `.stop()` ，而不用担心重复运行你的 `.rawStop` 实现。

### 确保停止

| 状态 | `.starp()` 的行为 | `.starp()` 的值 |
|---|---|---|
| STOPPED | 什么也不干 | 抛出异常 |
| STARTING | 使正在进行的这次启动过程最终失败，并立即开始停止过程 | 本次停止过程的 Promise |
| STARTED | 开始停止过程 | 本次停止过程的 Promise |
| STOPPING | 什么也不干 | 正在进行的这次停止过程的 Promise |

- `.starp()` 返回的 Promise 默认已经添加了一个空的 rejection handler，因此你可以 `this.starp()` 而不必 `this.starp().catch(() => {})`，不用担心停止过程本身的 rejection 抛到全局空间中去触发 `unhandledRejection`。
- `.starp()` 默认已经绑定到 Startable 上了，因此你可以把 `this.starp` 作为回调而不必 `err => this.starp(err)`。

## 自发启停

当自己发生内部错误时，就应当调用自己的 `.starp()`，因为在语义上，此时自己已经结束了「正常提供服务中」的状态。

```ts
class Daemon implements StartableLike {
    constructor() {
        super();
        this.someComponent.on('some fatal error', this.stop);
    }
}
```

`.start()` 可以接受一个 onStopping 钩子作为回调，用于在停止过程开始时通知外部。当停止过程开始时会先同步地调用这个回调，并将你填进 `.stop()` 的参数传递给这个回调。你可以自行定义这个 Error 参数的语义，然后在回调中根据参数判断停止的原因。

一般来说，如果是自发停止则传参，如果是从外部被动停止则不传参，这样就可以在回调中根据参数是否存在来判断是不是自发停止。

```ts
// main coroutine

const daemon = new Daemon();
function startDaemon(){
    daemon.start(err => {
        if (err) handleRunningException(err);
        daemon.stop().catch(handleStoppingException);
    }).catch(handleStartingException);
}
function stopDaemon() {
    // have a think about why .catch(handleStoppingException) is not necessary.
    daemon.stop();
}
```

## 丑陋的写法

```ts
class Daemon implements StartableLike {
    constructor() {
        super();
        this.someComponent.on('some fatal error', err => {
            handleRunningException(err); // don't do this.
            this.stop();
        });
    }
}

const daemon = new Daemon();
function startDaemon() {
    daemon.start(() => {
        daemon.stop().catch(handleStoppingException)
    }).catch(handleStartingException);
}
function stopDaemon() {
    daemon.stop();
}
```

这个例子的问题在于，一个后台对象中出现的一个让你不得不自发停止的致命错误，那么对这个异常的 handle 代码不应写在类定义的里面，因为这个 handle 过程在语义上不属于这个对象的一部分。

---

```ts
class Daemon implements StartableLike {
    constructor() {
        super();
        this.someComponent.on('some fatal error', err => {
            this.stop(err)
                .catch(handleStoppingException); // don't do this.
        });
    }
}

const daemon = new Daemon();
function startDaemon() {
    daemon.start(err => {
        if (err) handleRunningException(err);
    }).catch(handleStartingException);
}
function stopDaemon() {
    daemon.stop().catch(handleStoppingException); // don't do this.
}
```

这个例子的问题在于，一个后台对象的自发停止过程发生异常而失败，这个异常的 handle 代码不应写在 `.stop()` 的 caller 中，因为 caller 有很多个，不得不写很多遍。

## 嵌套

### Composition

如果一个 Startable 依赖于其内部的其他 Startable，即

- 当所有儿子的 `.start()` 都 fulfilled 后，爸爸的 `.start()` 才能 fulfilled。因为在语义上，只有当所有儿子都进入「正常提供服务中」的状态时，爸爸才算进入「正常提供服务中」的状态。
- 只要有一个儿子自发开始停止过程，即这个儿子运行了他自己的 `.stop()`，那么爸爸也必须立即开始停止过程。因为在语义上，只要有一个儿子离开了「正常提供服务中」的状态，爸爸就算不上「正常提供服务中」的状态了。

```ts
class Parent {
    private child1: Daemon;
    private child2: Daemon;

    protected async rawStart(): Promise<void> {
        await child1.start(this.starp);
        await child2.start(this.starp);
    }
    protected async rawStop(): Promise<void> {
        await child2.stop();
        await child1.stop();
    }
}
```

- 如果在 child2 启动过程中，已经启动完成的 child1 开始自发停止，那么 child1 会通过 onStopping 回调调用 parent 的 `.stop()`，此时 parent 处于 STARTING 状态，导致 parent 的启动过程 rejected。在语义上，一个后台对象启动过程中，他依赖的儿子挂了，这个后台对象的启动过程也确实算不上成功，因此语义与实现是一致的。
- 如果调用 `parent.stop()`，`parent.stop()` 会调用 `child.stop()`，`child.stop()` 会通过 onStopping 回调再次调用 `parent.stop()`，不过此时 parent 处于 STOPPING 状态，parent 内部的 `.rawStop` 实现不会被调用两次。

### Aggregation

一个 Startable 的依赖也可能是外部注入的 Startable。

```diff
    class Daemon implements StartableLike {
        constructor(private ctx: {
            dep: Startable;
        }) { super(); }

        protected async rawStart() {
-           assert(
-               this.ctx.dep.getReadyState() === ReadyState.STARTING ||
-               this.ctx.dep.getReadyState() === ReadyState.STARTED
-           );
-           await this.ctx.dep.start(this.starp);
+           await this.ctx.dep.assart(this.starp);
        }
    }
```

`assart()` 是一个等效的快捷方式，意思是 assert + start。

## 可复用性

如果想要让一个 Startable 对象可复用的话，`.rawStop` 的语义必须很严格：`.rawStop` 返回时对这个后台对象的停止工作已完全结束，可以立即开始新一轮启动。

如果 Startable 不需要复用的话，`.rawStop` 的语义可以比较宽松：`.rawStop` 返回时停止工作已经结束，但还没有为新一轮启动做好准备，比如内部某协程还差几个无关紧要事件循环没有跑完。

## 协程安全

写多线程要考虑线程同步问题，一个线程内的连续代码并不一定在连续时间片中运行，他们之间可能插入了其他时间片跑着其他线程的代码。同理，写多协程也要考虑协程同步问题，一个协程内的 await 两侧的连续代码并不一定在连续的事件循环中运行，他们之间可能插入了其他事件循环跑着其他协程的代码。

Startable 用 Promise 搞来搞去，必然存在协程同步问题。例如如果一个 Startable 被多个协程控制，那么在任意一个协程内

```ts
await daemon.start();
console.log(daemon.getReadyState());
```

的结果不一定是 STARTED，完全有可能是 STOPPING 或 STOPPED。而 Startable 的状态是成环的，搞不好甚至已经转了一圈到了下一次 STARTING 了。
