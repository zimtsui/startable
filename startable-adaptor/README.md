# adaptor

[![Npm package version](https://img.shields.io/npm/v/@zimtsui/startable-adaptor?style=flat-square)](https://www.npmjs.com/package/@zimtsui/startable-adaptor)


adaptor 函数在当前线程启动一个 [Startable](https://github.com/zimtsui/startable) 对象，并捕获 SIGTERM/SIGINT 信号优雅退出，还可以设置超时时间。

```ts
interface Adaptor {
    (
        daemon: Startable,
        startTimeout?: number,
        stopTimeout?: number,
    ): void;
}
```
