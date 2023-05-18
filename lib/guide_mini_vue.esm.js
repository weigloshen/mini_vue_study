const isObject = (val) => val !== null && typeof val === "object";

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

function createComponentInstance(vnode) {
    return {
        vnode,
        type: vnode.type,
        setupState: {},
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
    // 不可以放在前面要等 handleSetupResult(instance, setupResult); 执行完成
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
}
function handleSetupResult(instance, setupResult) {
    // fn ,obj
    // TODO function
    if (isObject(setupResult)) {
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
    patch(vnode, container);
}
function patch(vnode, container) {
    // 处理组件
    // 判断一下 是不是element 类型  processElement
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type));
    const { children, props } = vnode;
    // 判断children是一个string 还是一个 vnode(Object)
    if (typeof children === "string") {
        el.textContent = children; // 文本节点直接添加
    }
    else if (Array.isArray(children)) {
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
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
// 挂在组件节点
function mountComponent(initialVnode, container) {
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

function createVnode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
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
            render(vnode, rootContainer);
        },
    };
}

function h(type, props, children) {
    return createVnode(type, props, children);
}

export { createApp, h };
