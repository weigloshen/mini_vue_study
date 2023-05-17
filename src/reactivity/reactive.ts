import {
  mutableHandlers,
  readonlyHandlers,
  shallowHandlers,
} from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers);
}
export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowHandlers);
}

function createActiveObject(raw, BaseHandlers) {
  return new Proxy(raw, BaseHandlers);
}

export function isReactive(value) {
  // !转bool 再来一个!还原
  return !!value[ReactiveFlags.IS_REACTIVE];
}
export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
