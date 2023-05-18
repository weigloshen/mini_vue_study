import { h } from "../../lib/guide_mini_vue.esm.js";
export const App = {
  render() {
    return h("h1", "hi " + this.msg);
  },
  setup() {
    return {
      msg: " mini-vue",
    };
  },
};
