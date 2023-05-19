import { ShapeFlags } from "../shared/ShapeFlags";
import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./components";

export function render(vnode, container) {
  // 调用 patch， 方便后续的递归
  patch(vnode, container);
}
function patch(vnode: any, container: any) {
  // 处理组件
  // 判断一下 是不是element 类型  processElement
  const { shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container);
  }
}
function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type));

  const { children, props, shapeFlag } = vnode;

  // 判断children是一个string 还是一个 vnode(Object)
  if (shapeFlag & ShapeFlags.CHILDREN_STRING) {
    el.textContent = children; // 文本节点直接添加
  } else if (shapeFlag & ShapeFlags.CHILDREN_ARRAY) {
    mountChildren(children, el); // vnode子节点是用数组表示
  }
  const isOn = (key) => /^on[A-Z]/.test(key);
  // 添加vnode属性
  for (const key in props) {
    if (isOn(key)) {
      el.addEventListener(key.slice(2).toLocaleLowerCase(), props[key]);
    } else {
      el.setAttribute(key, props[key]);
    }
  }

  container.append(el);
}
// 添加子节点
function mountChildren(children, container) {
  children.forEach((v) => {
    patch(v, container);
  });
}
// 初始化组件节点
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}
// 挂在组件节点
function mountComponent(initialVnode: any, container) {
  const instance = createComponentInstance(initialVnode);
  setupComponent(instance);
  setupRenderEffect(instance, initialVnode, container);
}

function setupRenderEffect(instance, initialVnode, container) {
  const subTree = instance.render.call(instance.proxy);
  // vnode
  // vnode -> patch
  // vn-> element -> mountelement
  patch(subTree, container);

  initialVnode.el = subTree.el;
}
