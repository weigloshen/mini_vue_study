import { h } from "../../lib/guide_mini_vue.esm.js";

export const Foo = {
  setup(props) {},
  render() {
    return h("div", {}, "foo: " + this.count);
  },
};
  