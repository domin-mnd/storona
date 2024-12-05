import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/adapter.ts"],
  dts: true,
  format: ["cjs", "esm"],
  treeshake: "smallest",
  outDir: "./dist",
  clean: true,
  minify: "terser",
});
