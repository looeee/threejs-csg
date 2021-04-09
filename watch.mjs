import esbuild from "esbuild";

import glslify from "esbuild-glslify";

esbuild
  .build({
    plugins: [glslify()],
    entryPoints: ["src/CSG/CSG.js", "src/demo/main.js"],
    bundle: true,
    outdir: "dist",
    // minify: true,
    sourcemap: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.error("watch build succeeded:", result);
      },
    },
  })
  .then((result) => {
    // Call "stop" on the result when you're done
    // result.stop();
  })
  .catch((error) => {
    console.error(error);
    // process.exit(1)
  });
