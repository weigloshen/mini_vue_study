import { h } from "../../lib/guide_mini_vue.esm.js";
import { Foo } from "./foo.js";
window.self = null;
export const App = {
  name:"App",
  render() {
    window.self = this;
    return h(
      "h1",
      {
        id: "hei",
        class: "b-1 bg",
        onClick() {
          console.log("click");
        },
        onMousedown() {
          console.log("Mousedown");
        },
      },
      // "hi " + this.msg
      [
        h("span", { class: "red" }, "hi  "),
        h("span", { class: "blue" }, this.msg),
        h(Foo, { count: 3 }),
      ]
    );
  },
  setup() {
    return {
      msg: " mini-vue",
    };
  },
};
