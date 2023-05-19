import { emit } from "./componentEmit";
import { shallowReadonly } from "../reactivity/reactive";
import { isObject } from "../shared/index";
import { initPorps } from "./componentsProps";
import { PublicInstanceProxyHandlers } from "./componentsPublicInstance";

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: (event) => {},
  };
  component.emit = emit.bind(null, component);
  return component;
}

export function setupComponent(instance) {
  //TODO!
  initPorps(instance, shallowReadonly(instance.vnode.props));
  // initSlots()
  setupStatefulComponet(instance);
}

function setupStatefulComponet(instance: any) {
  const Component = instance.type;

  // ？？？不可以放在前面要等 handleSetupResult(instance, setupResult); 执行完成
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    // setup 可能是 fn or  object
    const setupResult = setup(instance.props, { emit: instance.emit });
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
