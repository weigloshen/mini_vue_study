import { ShapeFlags } from "../shared/ShapeFlags";
export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");
export function createVnode(type, props = {}, children?) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlags(type),
  };

  if (typeof children === "string") {
    vnode.shapeFlag |= ShapeFlags.CHILDREN_STRING;
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.CHILDREN_ARRAY;
  }
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === "object") {
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN;
    }
  }

  return vnode;
}

export function createTextVnode(text) {
  return createVnode(Text, {}, text);
}

function getShapeFlags(type) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}
