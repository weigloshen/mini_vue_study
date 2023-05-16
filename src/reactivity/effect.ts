class ReactiveEffect {
  private _fn: Function;
  constructor(fn: Function) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
}
const targetMap = new Map();
let activeEffect: any;
export function track(traget: any, key: any) {
  // target -> key -> dep
  let depsMap = targetMap.get(traget);

  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(traget, new Map(depsMap));
  }

  let dep: Set<any> = depsMap.get(key);

  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect);
}
export function trigger(traget: any, key: any) {
  let depsMap = targetMap.get(traget);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    effect.run();
  }
}

export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
  return _effect.run.bind(_effect);
}
