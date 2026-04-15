import { activeEffect, trackEffect, triggerEffects } from "./effect.js"

export const createDep = (cleanup: any, key: any) => {
    const dep = new Map() as any;
    dep.cleanup = cleanup;
    dep.key = key;
    return dep;
}

const targetMap = new WeakMap(); // 存放依赖收集的关系
export function track(target: any, key: any) {
    if (activeEffect) {
        // 收集依赖的逻辑
        let depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }

        let dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(key, (dep = createDep(() => {
                depsMap.delete(key)
            }, key)));
        }

        // targetMap -> depsMap -> dep -> effect
        // 将effect放到对应的对象的值的mapValue中，也就是dep中
        trackEffect(activeEffect, dep);
        console.log(targetMap);
    }
}

export function trigger(target: any, key: any, value: any, oldValue: any) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    const dep = depsMap.get(key);
    if (dep) {
        triggerEffects(dep);
    }
}