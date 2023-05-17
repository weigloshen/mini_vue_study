import { track, trigger } from "./effect";
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
function createGetter(readonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
    if (!readonly) {
      track(target, key);
    }
    return res;
  };
}

function createSetter(readonly = false) {
  return function (target, key, value) {
    const res = Reflect.set(target, key, value);
    // 触发依赖
    trigger(target, key);
    return res;
  };
}
export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`keyh:${key} set 失败 因为target 是 readonly, ${target} `);

    return true;
  },
};
