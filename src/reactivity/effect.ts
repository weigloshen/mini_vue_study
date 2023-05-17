import { extend } from "../shared";

class ReactiveEffect {
  private _fn: Function;
  deps = [];
  active = true;
  onStop?: Function;
  constructor(fn: Function, public scheduler?: Function) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}
// Map 结构  [ { key:'', value: '' } ]  key 的设定可以多样性。相对 Obj 有更多的拓展，例如 key : funciton()
// targetMap 用于储存依赖
const targetMap = new Map();

export function track(traget: any, key: any) {
  // 依赖收集 && 触发依赖 函数 用于 后面响应数据，更新数据
  // 先取出 全部的 target，
  // target -> key -> dep
  let depsMap = targetMap.get(traget);

  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(traget, depsMap);
  }

  let dep: Set<any> = depsMap.get(key);

  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  if (!activeEffect) return;
  dep.add(activeEffect);

  activeEffect.deps.push(dep);
}
export function trigger(traget: any, key: any) {
  let depsMap = targetMap.get(traget);
  let dep = depsMap.get(key);

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
let activeEffect: any;
export function effect(fn: Function, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);

  // Object.assign(_effect,options)
  extend(_effect, options);
  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner: any) {
  runner.effect.stop();
}
