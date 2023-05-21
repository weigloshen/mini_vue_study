import { ShapeFlags } from "../shared/ShapeFlags";
import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./components";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProps: hostPatchProps,
    insert: hostInsert,
  } = options;

  function render(vnode, container, parentComponent) {
    // 调用 patch， 方便后续的递归
    patch(vnode, container, parentComponent);
  }
  function patch(vnode: any, container: any, parentComponent) {
    // 处理组件
    // 判断一下 是不是element 类型  processElement
    const { shapeFlag, type } = vnode;
    switch (type) {
      case Fragment:
        processFragment(vnode.children, container, parentComponent);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parentComponent);
        }
        break;
    }
  }

  function processText(vnode: any, container: any) {
    const { children } = vnode;
    const textNode = document.createTextNode(children);
    container.append(textNode);
  }

  function processFragment(vnode: any, container: any, parentComponent) {
    mountChildren(vnode, container, parentComponent);
  }

  function processElement(vnode: any, container: any, parentComponent) {
    mountElement(vnode, container, parentComponent);
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    // const el = (vnode.el = document.createElement(vnode.type));
    const el = (vnode.el = hostCreateElement(vnode.type));

    const { children, props, shapeFlag } = vnode;

    // 判断children是一个string 还是一个 vnode(Object)
    if (shapeFlag & ShapeFlags.CHILDREN_STRING) {
      el.textContent = children; // 文本节点直接添加
    } else if (shapeFlag & ShapeFlags.CHILDREN_ARRAY) {
      mountChildren(children, el, parentComponent); // vnode子节点是用数组表示
    }

    // // 添加vnode属性
    for (const key in props) {
      const value = props[key];
      hostPatchProps(el, key, value);
    }

    // container.append(el);
    hostInsert(el, container);
  }
  // 添加子节点
  function mountChildren(children, container, parentComponent) {
    children.forEach((v) => {
      patch(v, container, parentComponent);
    });
  }
  // 初始化组件节点
  function processComponent(vnode: any, container: any, parentComponent) {
    mountComponent(vnode, container, parentComponent);
  }
  // 挂在组件节点
  function mountComponent(initialVnode: any, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container, parentComponent);
  }

  function setupRenderEffect(
    instance,
    initialVnode,
    container,
    parentComponent
  ) {
    const subTree = instance.render.call(instance.proxy);
    // vnode
    // vnode -> patch
    // vn-> element -> mountelement
    patch(subTree, container, instance);

    initialVnode.el = subTree.el;
  }
  return {
    createApp: createAppAPI(render),
  };
}
