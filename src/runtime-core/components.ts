import { emit } from "./componentEmit";
import { shallowReadonly } from "../reactivity/reactive";
import { isObject } from "../shared/index";
import { initProps } from "./componentsProps";
import { PublicInstanceProxyHandlers } from "./componentsPublicInstance";
import { initSlots } from "./componentSlots";
import { proxyRefs } from "../index";

export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    isMounted: false,
    subTree: {},
    provides: parent ? parent.provides : {},
    parent,
    emit: (event) => {},
  };
  component.emit = emit.bind(null, component);
  return component;
}

export function setupComponent(instance) {
  //TODO!
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  // ？？？不可以放在前面要等 handleSetupResult(instance, setupResult); 执行完成
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    // setup 可能是 fn or  object
    setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance: any, setupResult: any) {
  // fn ,obj
  // TODO function
  if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  }

  finishComponentSetup(instance);
}
function finishComponentSetup(instance: any) {
  const Component = instance.type;

  if (Component.render) {
    instance.render = Component.render;
  }
}
let currentInstance = null;
export function getCurrentInstance() {
  return currentInstance;
}

function setCurrentInstance(instance) {
  currentInstance = instance;
}
