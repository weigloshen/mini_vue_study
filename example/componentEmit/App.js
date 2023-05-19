import { h } from "../../lib/guide_mini_vue.esm.js";
import { Foo } from "./Foo.js";
// 调试使用。
window.self = null;
export const App = {
  name: "App",
  // 必须写 render
  render() {
    window.self = this;
    // 渲染的 ui
    return h("div", {}, [
      h("div", {}, "App"),
      h(Foo, {
        onAdd(a, b) {
          console.log("onAdd", a, b);
        },
        onAddFoo() {
          console.log("onAddFoo");
        },
      }),
    ]);
  },

  setup() {
    return {
      msg: "mini-vue-ddaaaaaadd",
    };
  },
};
