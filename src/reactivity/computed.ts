import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _getter: Function;
  private dirty: boolean = true;
  private _value: any;
  private _effect: ReactiveEffect;
  constructor(getter: Function) {
    this._getter = getter;
    this._effect = new ReactiveEffect(getter, () => {
      if (!this.dirty) {
        this.dirty = true;
      }
    });
  }
  get value() {
    if (this.dirty) {
      this.dirty = false;
      this._value = this._effect.run();
    }
    return this._value;
  }
}

export function computed(fn: Function) {
  return new ComputedRefImpl(fn);
}
