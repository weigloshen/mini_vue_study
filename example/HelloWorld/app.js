import { h } from "../../lib/guide_mini_vue.esm.js";
window.self = null;
export const App = {
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
        }
      },
      "hi " + this.msg
      // [
      //   h("span", { class: "red" }, "hi  "),
      //   h("span", { class: "blue" }, "mini-vue"),
      // ]
    );
  },
  setup() {
    return {
      msg: " mini-vue",
    };
  },
};
