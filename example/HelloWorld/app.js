import { h } from "../../lib/guide_mini_vue.esm.js";
export const App = {
  render() {
    return h(
      "h1",
      {
        id: "hei",
        class:"b-1 bg"
      },
      // "hi mini-vue"
      [
        h("span", { class: "red" }, "hi  "),
        h("span", { class: "blue" }, "mini-vue"),
      ]
    );
  },
  setup() {
    return {
      msg: " mini-vue",
    };
  },
};
