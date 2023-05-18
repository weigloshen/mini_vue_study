function createComponentInstance(vnode) {
    return {
        vnode,
        type: vnode.type,
    };
}
function setupComponent(instance) {
    //TODO!
    // initPorps()
    // initSlots()
    setupStatefulComponet(instance);
}
function setupStatefulComponet(instance) {
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        // setup 可能是 fn or  object
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // fn ,obj
    // TODO function
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    // 调用 patch， 方便后续的递归
    patch(vnode);
}
function patch(vnode, container) {
    // 处理组件
    // 判断一下 是不是element 类型
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vnode
    // vnode -> patch
    // vn-> element -> mountelement
    patch(subTree);
}

function createVnode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // vue3 把所有东西转换成 vnode
            // component -> vnode
            // 所有操作 基于 vnode 处理
            const vnode = createVnode(rootComponent);
            // 操作vnode
            render(vnode);
        },
    };
}

function h(type, props, children) {
    return createVnode(type, props, children);
}

export { createApp, h };
