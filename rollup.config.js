// rollup.config.js
import typescript from "rollup-plugin-typescript2";
export default {
  input: "./src/index.ts",
  output: [
    // cjs -> commonjs
    // esm
    {
      format: "cjs",
      file: "lib/guide_mini_vue.cjs.js",
    },
    {
      format: "es",
      file: "lib/guide_mini_vue.esm.js",
    },
  ],
  plugins: [typescript()],
};
