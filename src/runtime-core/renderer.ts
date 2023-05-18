import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./components";

export function render(vnode, container) {
  // 调用 patch， 方便后续的递归
  patch(vnode, container);
}
function patch(vnode: any, container: any) {
  // 处理组件
  // 判断一下 是不是element 类型  processElement

  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container);
  }
}
function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const el = document.createElement(vnode.type);

  const { children, props } = vnode;

  // 判断children是一个string 还是一个 vnode(Object)
  if (typeof children === "string") {
    el.textContent = children;  // 文本节点直接添加
  } else if (Array.isArray(children)) {
    mountChildren(children, el); // vnode子节点是用数组表示
  }
  // 添加vnode属性
  for (const key in props) {
    el.setAttribute(key, props[key]);
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
function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render();
  // vnode
  // vnode -> patch
  // vn-> element -> mountelement
  patch(subTree, container);
}
