import { createRenderer } from "../runtime-core/index";

export function createElement(type) {
  // console.log("createElement--------");

  return document.createElement(type);
}
function patchProps(el, key, value) {
  // console.log("patchProps--------");
  const isOn = (key) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    el.addEventListener(key.slice(2).toLocaleLowerCase(), value);
  } else {
    el.setAttribute(key, value);
  }
}
export function insert(el, parent) {
  // console.log("insert------");

  parent.append(el);
}

const renderer: any = createRenderer({
  createElement,
  patchProps,
  insert,
});

export function createApp(...args) {
  return renderer.createApp(...args);
}
export * from "../runtime-core/index";
