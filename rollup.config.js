import nodeResolve from "@rollup/plugin-node-resolve";

const input = "src/main.js";
const output = "build/main.js";

const plugins = [
  nodeResolve({
    mainFields: ["module"],
  }),
];

function createConfig() {
  return {
    watch: {
      // chokidar: true,
      include: "src/**",
    },
    input,
    plugins,
    treeshake: {
      moduleSideEffects: false,
    },
    output: [
      // {
      //   file: `${outputDir}/${app}.js`,
      //   format: 'iife',
      //   sourcemap: true,
      //   name: 'CSG',
      // },
      {
        format: "esm",
        sourcemap: true,
        file: output,
      },
    ],
  };
}

export default () => {
  return createConfig();
};
