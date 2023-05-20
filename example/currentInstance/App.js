import { h, getCurrentInstance } from "../../lib/guide_mini_vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    return h("div", {}, [h("p", {}, "app currentInstance demo"), h(Foo)]);
  },

  setup() {
    const instance = getCurrentInstance();
    console.log(instance);
  },
};
