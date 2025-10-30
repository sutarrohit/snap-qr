import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

const packageJson = require("./package.json");

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: true,
                inlineDynamicImports: true
            },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true,
                inlineDynamicImports: true
            }
        ],
        plugins: [
            peerDepsExternal(),
            resolve(),
            commonjs(),
            postcss(),
            typescript({ tsconfig: "./tsconfig.json" }),
            terser()
        ],
        external: ["react", "react-dom", "react/jsx-runtime"]
    },
    {
        input: "src/index.ts",
        output: [{ file: packageJson.types }],
        plugins: [dts.default()]
    }
];
