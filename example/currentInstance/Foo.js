import { h, getCurrentInstance } from "../../lib/guide_mini_vue.esm.js";

export const Foo = {
  name: "Foo",
  setup() {
    const instance = getCurrentInstance();
    console.log(instance);
  },
  render() {
    return h("div", {}, [h("p", {}, "foo")]);
  },
};
