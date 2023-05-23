import { hasChange, isObject } from "../shared/index";
import { isTracking, trackEffect, triggerEffect } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value;
  private _raw_value;
  public dep;
  public __v__isRef = true;
  constructor(value) {
    this._value = convert(value); //value 有可能是Object
    this.dep = new Set();
    this._raw_value = value;
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    if (hasChange(this._raw_value, newVal)) {
      this._raw_value = newVal;
      this._value = convert(newVal);
      triggerEffect(this.dep); // 主意好顺序先改变值再触发依赖
    }
  }
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffect(ref.dep);
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(value) {
  return new RefImpl(value);
}

export function isRef(ref) {
  return !!ref.__v__isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}
export function proxyRefs(refs) {
  return new Proxy(refs, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      if (isRef(Reflect.get(target, key)) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
