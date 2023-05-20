import { emit } from "./componentEmit";
import { shallowReadonly } from "../reactivity/reactive";
import { isObject } from "../shared/index";
import { initPorps } from "./componentsProps";
import { PublicInstanceProxyHandlers } from "./componentsPublicInstance";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    emit: (event) => {},
  };
  component.emit = emit.bind(null, component);
  return component;
}

export function setupComponent(instance) {
  //TODO!
  initPorps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponet(instance);
}

function setupStatefulComponet(instance: any) {
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
    instance.setupState = setupResult;
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
