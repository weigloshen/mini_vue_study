export function createComponentInstance(vnode) {
  return {
    vnode,
    type: vnode.type,
  };
}

export function setupComponent(instance) {
  //TODO!
  // initPorps()
  // initSlots()
  setupStatefulComponet(instance);
}
function setupStatefulComponet(instance: any) {
  const Component = instance.type;

  const { setup } = Component;
  if (setup) {
    // setup 可能是 fn or  object
    const setupResult = setup();
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance: any, setupResult: any) {
  // fn ,obj
  // TODO function
  if (typeof setupResult === "object") {
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
