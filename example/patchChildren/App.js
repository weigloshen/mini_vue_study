import { h, ref } from "../../lib/guide_mini_vue.esm.js";
import ArrayToText from "./ArrayToText.js";
import ArrayToArray from "./ArrayToArray.js";
import textToArray from "./textToArray.js";
import textToText from "./textToText.js";
export default {
  name: "App",
  setup() {},
  render() {
    return h("div", { tId: 1 }, [
      h("p", {}, "主页"),
      // h(ArrayToText),
      // h(ArrayToArray),
      h(textToArray),
      // h(textToText),
    ]);
  },
};
