export function effect(fn: any, options?: any) {
    const _effect = new ReactiveEffect(fn, () => {
        _effect.run();
        console.log(2);
    })
    _effect.run();
    console.log(1);
    return _effect;
}

export let activeEffect: any;

class ReactiveEffect {
    _trackId = 100; // 唯一标识 记录当前effect执行了几次
    deps = []  // 依赖集合，存放这个effect被哪些属性收集了
    _depsLength = 0; // 记录当前effect被收集了几次

    public active = true; // 默认创建的effect是响应式的
    constructor(public fn: any, public scheduler: any) {

    }
    run() {
        // 不是激活的，执行后什么也不做
        if (!this.active) {
            return this.fn();
        }
        let lastEffect = activeEffect;
        try {
            // 注册了不用就要销毁掉，不然就会一直占用内存，并且会在不是effect的时候也触发effect的依赖收集
            activeEffect = this;
            return this.fn();
        } finally {
            // 回溯，避免嵌套effect而丢失外层的effect
            activeEffect = lastEffect;
        }
    }
    stop() {
        this.active = false;   // 未实现2
    }
}

export function trackEffect(effect: any, dep: any) {
    dep.set(effect, effect._trackId);
    effect.deps[effect._depsLength++] = dep;
}

export function triggerEffects(dep: any) {
    for (const effect of dep.keys()) {
        if (effect.scheduler) {
            effect.scheduler();
        }
    }
}