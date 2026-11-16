// rollup.config.js

import merge from "deepmerge";
import { createBasicConfig } from "@open-wc/building-rollup";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const baseConfig = createBasicConfig();

export default merge(baseConfig, [
  {
    input: "./dist/esm/src/index.js",
    output: {
      dir: "lib/src",
      format: "esm",
      exports: "named",
      // Next's App Router must treat the calendar as a client component.
      banner: '"use client";',
    },
    // Top-level `this` in tsc's ES5 helpers (`this && this.__assign`). Must exist
    // on the server too: "window" throws during Next.js SSR/prerender.
    context: "globalThis",
    plugins: [
      // Bundles the calendar's own dependencies; peers stay external.
      nodeResolve({ browser: true, extensions: [".js", ".mjs", ".jsx"] }),
      commonjs(),
      typescript({
        rollupCommonJSResolveHack: false,
        clean: true,
      }),
      postcss({
        plugins: [autoprefixer()],
        sourceMap: true,
        // Injected at runtime, so hosts don't have to import a stylesheet.
        inject: true,
        minimize: true,
      }),
      // directives: false keeps the "use client" banner.
      terser({ compress: { directives: false } }),
    ],
    // Peers: the host's single copy (styled-components needs one instance for SSR styles).
    external: ["react", "react-dom", "react/jsx-runtime", "styled-components"],
  },
]);
