import { hasChange, isObject } from "../shared";
import { isTracking, trackEffect, triggerEffect } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value;
  private _raw_value;
  public dep;
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
