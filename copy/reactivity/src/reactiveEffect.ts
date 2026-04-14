import { activeEffect } from "./effect.js"


export function track(target: any, key: any) {
    if (activeEffect) {
        // 收集依赖的逻辑
        console.log(key, activeEffect);
    }

}