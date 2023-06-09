import { effect } from "../reactivity/effect";
import { ShapeFlags } from "../shared/ShapeFlags";
import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./components";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProps,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;

  function render(vnode, container, parentComponent) {
    // 调用 patch， 方便后续的递归
    patch(null, vnode, container, parentComponent);
  }
  // n1 old
  // n2 new
  function patch(n1, n2: any, container: any, parentComponent) {
    // 处理组件
    // 判断一下 是不是element 类型  processElement
    const { shapeFlag, type } = n2;

    switch (type) {
      case Fragment:
        processFragment(n1, n2.children, container, parentComponent);
        console.log("processFragment");

        break;
      case Text:
        processText(n1, n2, container);
        console.log("processText");
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
          console.log("processElement");
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          console.log("parentComponent");

          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }

  function processText(n1, n2: any, container: any) {
    const { children } = n2;
    const textNode = document.createTextNode(children);
    container.append(textNode);
  }

  function processFragment(n1, n2: any, container: any, parentComponent) {
    mountChildren(n2, container, parentComponent);
  }

  function processElement(n1, n2: any, container: any, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container, parentComponent);
    }
  }

  function patchElement(n1, n2, container, parentComponent) {
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    const el = (n2.el = n1.el);

    patchChildren(n1, n2, el, parentComponent);
    patchProps(el, oldProps, newProps);
  }

  function patchChildren(n1, n2, container, parentComponent) {
    const preShapeFlag = n1.shapeFlag;
    const nextShapeFlag = n2.shapeFlag;
    const c1 = n1.children;
    let c2 = n2.children;
    if (nextShapeFlag & ShapeFlags.CHILDREN_STRING) {
      if (preShapeFlag & ShapeFlags.CHILDREN_ARRAY) {
        // 清空老的 children
        unmountChildren(n1.children);
      }
      if (c1 !== c2) {
        // 设置text
        hostSetElementText(container, c2);
      }
    } else {
      if (preShapeFlag & ShapeFlags.CHILDREN_STRING) {
        hostSetElementText(container, "");
        mountChildren(c2, container, parentComponent);
      }
    }
  }

  function unmountChildren(children) {
    for (let index = 0; index < children.length; index++) {
      const el = children[index].el;
      hostRemove(el);
    }
  }

  const EMPTY_OBJ = {};
  function patchProps(el, oldProps, newProps) {
    for (const key in newProps) {
      const prevProp = oldProps[key];
      const nextProp = newProps[key];

      if (prevProp !== newProps) {
        hostPatchProps(el, key, prevProp, nextProp);
      }
    }
    if (oldProps !== EMPTY_OBJ) {
      for (const key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProps(el, key, oldProps[key], null);
        }
      }
    }
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
      hostPatchProps(el, key, null, value);
    }

    // container.append(el);
    hostInsert(el, container);
  }
  // 添加子节点
  function mountChildren(children, container, parentComponent) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent);
    });
  }
  // 初始化组件节点
  function processComponent(n1, n2: any, container: any, parentComponent) {
    mountComponent(n2, container, parentComponent);
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
    effect(() => {
      if (!instance.isMounted) {
        const subTree = (instance.subTree = instance.render.call(
          instance.proxy
        ));
        // vnode
        // vnode -> patch
        // vn-> element -> mount element
        patch(null, subTree, container, instance);

        initialVnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const preSubTree = instance.subTree;
        instance.subTree = subTree;
        // console.log(preSubTree);
        console.log(subTree);

        // console.log("current", subTree);
        // console.log("before", preSubTree);
        patch(preSubTree, subTree, container, instance);
      }
    });
  }
  return {
    createApp: createAppAPI(render),
  };
}
