import { defineConfig } from "korob";

export default defineConfig({
  build: {
    entry: ["src/adapter.ts"],
    dts: true,
    format: ["cjs", "esm"],
    treeshake: "smallest",
    clean: true,
    minify: true,
  },
  diagnostics: {
    biome: {
      linter: {
        rules: {
          style: {
            useNodejsImportProtocol: "off",
          },
          suspicious: {
            noExplicitAny: "off",
          },
        },
      },
    },
  },
});
