"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stopping = exports.Unstarted = exports.Started = exports.Starting = exports.Unstopped = exports.Stopped = exports.State = void 0;
const interfaces_1 = require("./interfaces");
const manual_promise_1 = require("manual-promise");
class State {
    constructor(ctx, setState) {
        this.ctx = ctx;
        this.setState = setState;
        setState(this);
    }
}
exports.State = State;
class Stopped extends State {
    constructor(ctx, setState, prevState, args) {
        super(ctx, setState);
        this.ctx = ctx;
        this.setState = setState;
        this.readyState = "STOPPED" /* STOPPED */;
        this.stoppingPromise = prevState.stoppingPromise;
        this.rawStart = prevState.rawStart;
        this.rawStop = prevState.rawStop;
    }
    async start(onStopping) {
        const nextState = new Starting(this.ctx, this.setState, this, { onStopping });
        await nextState.startingPromise;
    }
    async stop() {
        await this.stoppingPromise;
    }
}
exports.Stopped = Stopped;
class Unstopped extends Stopped {
    constructor() {
        super(...arguments);
        this.readyState = "UNSTOPPED" /* UNSTOPPED */;
    }
}
exports.Unstopped = Unstopped;
class Starting extends State {
    constructor(ctx, setState, prevState, args) {
        super(ctx, setState);
        this.ctx = ctx;
        this.setState = setState;
        this.readyState = "STARTING" /* STARTING */;
        this.startingPromise = new manual_promise_1.ManualPromise();
        this.onStoppings = [];
        this.startingIsFailedManually = false;
        this.rawStart = prevState.rawStart;
        this.rawStop = prevState.rawStop;
        if (args.onStopping)
            this.onStoppings.push(args.onStopping);
        // https://github.com/microsoft/TypeScript/issues/38929
        this.setup();
    }
    ;
    async setup() {
        try {
            await this.rawStart();
            if (this.startingIsFailedManually)
                throw new interfaces_1.StartingFailedManually();
            this.startingPromise.resolve();
            new Started(this.ctx, this.setState, this, {});
        }
        catch (err) {
            this.startingPromise.reject(err);
            new Unstarted(this.ctx, this.setState, this, {});
        }
    }
    async start(onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.startingPromise;
    }
    async stop(err) {
        this.startingIsFailedManually = true;
        await this.startingPromise.catch(() => { });
        await this.ctx.stop(err);
    }
}
exports.Starting = Starting;
class Started extends State {
    constructor(ctx, setState, prevState, args) {
        super(ctx, setState);
        this.ctx = ctx;
        this.setState = setState;
        this.readyState = "STARTED" /* STARTED */;
        this.rawStart = prevState.rawStart;
        this.rawStop = prevState.rawStop;
        this.startingPromise = prevState.startingPromise;
        this.onStoppings = prevState.onStoppings;
    }
    async start(onStopping) {
        if (onStopping)
            this.onStoppings.push(onStopping);
        await this.startingPromise;
    }
    async stop(err) {
        const nextState = new Stopping(this.ctx, this.setState, this, { err });
        await nextState.stop(err);
    }
}
exports.Started = Started;
class Unstarted extends Started {
    constructor() {
        super(...arguments);
        this.readyState = "UNSTARTED" /* UNSTARTED */;
    }
}
exports.Unstarted = Unstarted;
class Stopping extends State {
    constructor(ctx, setState, prevState, args) {
        super(ctx, setState);
        this.ctx = ctx;
        this.setState = setState;
        this.readyState = "STOPPING" /* STOPPING */;
        this.stoppingPromise = new manual_promise_1.ManualPromise();
        this.rawStart = prevState.rawStart;
        this.rawStop = prevState.rawStop;
        this.startingPromise = prevState.startingPromise;
        this.onStoppings = prevState.onStoppings;
        for (const onStopping of this.onStoppings)
            onStopping(args.err);
        this.setup();
    }
    async setup() {
        try {
            await this.rawStop();
            this.stoppingPromise.resolve();
            new Stopped(this.ctx, this.setState, this, {});
        }
        catch (err) {
            this.stoppingPromise.reject(err);
            new Unstopped(this.ctx, this.setState, this, {});
        }
    }
    async start(onStopping) {
        await this.startingPromise;
    }
    async stop(err) {
        await this.stoppingPromise;
    }
}
exports.Stopping = Stopping;
const StoppedAlias = Stopped;
const UnstoppedAlias = Unstopped;
const StartingAlias = Starting;
const StartedAlias = Starting;
const UnstartedAlias = Unstarted;
const StoppingAlias = Stopping;
(function (State) {
    State.Stopped = StoppedAlias;
    State.Unstopped = UnstoppedAlias;
    State.Starting = StartingAlias;
    State.Started = StartedAlias;
    State.Unstarted = UnstartedAlias;
    State.Stopping = StoppingAlias;
})(State = exports.State || (exports.State = {}));
//# sourceMappingURL=states.js.map