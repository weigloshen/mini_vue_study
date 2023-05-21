// 组件 provide 和 inject 功能
import { h, provide, inject } from "../../lib/guide_mini_vue.esm.js";

const Provider = {
  name: "Provider",
  setup() {
    provide("foo", "fooVal");
    provide("bar", "barVal");
  },
  render() {
    return h("div", {}, [h("p", {}, "Provider"), h(ProviderTwo)]);
  },
};

const ProviderTwo = {
  name: "ProviderTwo",
  setup() {
    const foo = inject("foo");
    provide("foo", "fooTwo");
    provide("baz", "bazTwo");
    return {
      foo,
    };
  },
  render() {
    return h("div", {}, [
      h("p", {}, `ProviderTwo foo:${this.foo}`),
      h(Consumer),
    ]);
  },
};

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    const baz = inject("baz", "bazDefault");
    const bac = inject("bac", () => "bacDefault");

    return {
      foo,
      bar,
      baz,
      bac
    };
  },

  render() {
    return h("div", {}, `Consumer: - ${this.foo} - ${this.bar} - ${this.baz} - ${this.bac}`);
  },
};

export default {
  name: "App",
  setup() {},
  render() {
    return h("div", {}, [h(Provider)]);
  },
};
