import { createAdapter } from "@/adapter";
import type { Express } from "express";
import { registerRoute } from "./registerRoute";
import type { M, H, R } from "./types";
import { assertExportedVariables, assertMethod } from "./assert";

export const adapter = createAdapter<H, M, R, Express, {}>(
  (instance, _options = {}) => ({
    version: "1.0.0",
    on: {
      route: (structure) => {
        assertMethod(structure.method);
        return structure;
      },
      register: (importData) => {
        assertExportedVariables(importData);
        return registerRoute(instance, importData);
      },
    },
  })
);
