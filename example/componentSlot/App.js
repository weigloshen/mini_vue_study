import { h, createTextVnode } from "../../lib/guide_mini_vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    const app = h("h3", {}, "App");
    // const foo = h(Foo, {}, [h("p", {}, "bar"), h("p", {}, "SLOT")]);
    //const foo = h(Foo, {}, h("p", {}, "bar"));
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [
          h("p", { class: "header" }, "header " + age),
          createTextVnode("NIHAO"),
        ],
        footer: () => h("p", { class: "footer" }, "footer"),
      }
    );

    return h("div", { class: "root" }, [app, foo]);
  },
  setup() {
    return {};
  },
};
