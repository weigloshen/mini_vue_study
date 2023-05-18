import { createComponentInstance, setupComponent } from "./components";

export function render(vnode, container) {
  // 调用 patch， 方便后续的递归
  patch(vnode, container);
}
function patch(vnode: any, container: any) {
  // 处理组件
  // 判断一下 是不是element 类型
  processComponent(vnode, container);
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

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
