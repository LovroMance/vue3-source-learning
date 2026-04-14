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
}