import { activeEffect } from "./effect.js";
import { track, trigger } from "./reactiveEffect.js";
//  reactive标识
export enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
}

export const mutableHandlers: ProxyHandler<any> = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true;
        }
        // debugger; 调试
        // 通过属性的访问来收集依赖
        track(target, key);

        return Reflect.get(target, key, receiver);
        // Reflect中的this指向代理，而不是原始对象
        // 如果现在有一个name，然后我定义一个getName方法，如果不使用
        // Reflect的话，当name发生变化的时候，getName方法就无法获取到最新的name了
        //return target[key]; 会导致获得的如果是方法，里面的指向就会指向原始对象而非代理Proxy
    },

    set(target, key, value, receiver) {
        let oldValue = target[key];
        let result = Reflect.set(target, key, value, receiver);

        if (oldValue !== value) {
            // 新旧不同 -> 触发更新
            trigger(target, key, value, oldValue);
        }
        return result;
    },
};
