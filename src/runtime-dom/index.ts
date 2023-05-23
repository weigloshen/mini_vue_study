import { createRenderer } from "../runtime-core/index";

export function createElement(type) {
  // console.log("createElement--------");

  return document.createElement(type);
}
function patchProp(el: Element, key, preValue, nextValue) {
  // console.log("patchProps--------");
  const isOn = (key) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    el.addEventListener(key.slice(2).toLocaleLowerCase(), nextValue);
  } else {
    if (nextValue === null || nextValue === undefined) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextValue);
    }
  }
}

export function remove(child) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}
export function setElementText(el, text) {
  el.textContent = text;
}

export function insert(el, parent) {
  // console.log("insert------");

  parent.append(el);
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText,
});

export function createApp(...args) {
  return renderer.createApp(...args);
}
export * from "../runtime-core/index";
