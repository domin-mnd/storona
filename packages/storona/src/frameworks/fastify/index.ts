import { createAdapter } from "@/adapter";
import type { FastifyInstance } from "fastify";
import { registerRoute } from "./registerRoute";
import type { M, H, R } from "./types";
import { assertExportedVariables, assertMethod } from "./assert";

export const adapter = createAdapter<H, M, R, FastifyInstance, {}>(
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
