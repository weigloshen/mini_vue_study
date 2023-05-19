import { isObject } from "../shared/index";
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
  return createReactiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}
export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowHandlers);
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
function createReactiveObject(raw, BaseHandlers) {
  if (!isObject(raw)) {
    console.warn("raw必须是一个对象");
    return raw;
  }
  return new Proxy(raw, BaseHandlers);
}
