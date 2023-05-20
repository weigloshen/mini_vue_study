import { ShapeFlags } from "../shared/ShapeFlags";
import { isArray } from "../shared/index";

export function initSlots(instance, children) {
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    nomarlizeObjectSlots(children, instance.slots);
  }
}

function nomarlizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key];
    slots[key] = (props) => nomarlizeSlotValue(value(props));
  }
}

function nomarlizeSlotValue(value) {
  return isArray(value) ? value : [value];
}
