import { isObject } from "@vue/shared";
import { ReactiveFlags, mutableHandlers } from "./baseHandler.js";
// reactive shallowReactive
// 缓存表(object, proxy)
const reactiveMap = new WeakMap();
function createReactiveObject(target: any) {
    if (!isObject(target)) {
        return;
    }

    // 已经是reactive了，直接返回
    // 只有是代理才会触发代理的get，而在那里会返回true，否则不会是true也就认定这不是一个代理对象
    if (target[ReactiveFlags.IS_REACTIVE]) {
        return target;
    }

    // 检查缓存表
    const existingProxy = reactiveMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }

    // 无缓存，创建代理
    let proxy = new Proxy(target, mutableHandlers);
    reactiveMap.set(target, proxy);
    return proxy;
}

export function reactive(target: any) {
    return createReactiveObject(target);
}