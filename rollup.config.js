// rollup.config.js

import merge from "deepmerge";
import { createBasicConfig } from "@open-wc/building-rollup";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";

const baseConfig = createBasicConfig();

export default merge(baseConfig, [
  {
    input: "./dist/esm/src/index.js",
    output: {
      dir: "lib/src",
      format: "esm",
      exports: "named",
    },
    context: "window",
    plugins: [
      typescript({
        rollupCommonJSResolveHack: false,
        clean: true,
      }),
      postcss({
        plugins: [autoprefixer()],
        sourceMap: true,
        extract: true,
        minimize: true,
      }),
      terser(),
    ],
    external: ["react", "react-dom"],
  },
]);
