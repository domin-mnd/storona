import type { CorrectImport } from "@/adapter";
import type { M, H, R } from "./types";

export const METHODS: M[] = [
  "get",
  "post",
  "put",
  "delete",
  "patch",
  "options",
  "head",
];

export function assertMethod(method: string): asserts method is M {
  if (!METHODS.includes(method as M)) {
    throw new Error(
      "Method must be one of: get, post, put, delete, patch, options, head"
    );
  }
}

export function assertExportedVariables(
  route: unknown
): asserts route is CorrectImport<H, M, R> {
  if (typeof route !== "object" || route === null) {
    throw new Error("No exports found");
  }

  if ("method" in route) {
    const typeOfMethod = typeof route.method;

    if (typeOfMethod !== "string" || !METHODS.includes(route.method as M)) {
      throw new Error("Invalid exported method type");
    }
  }

  if ("route" in route) {
    const typeOfRoute = typeof route.route;

    if (typeOfRoute !== "string") {
      if (typeOfRoute === "object" && route.route instanceof RegExp) {
        throw new Error("Exported route cannot be RegExp in Fastify");
      }

      throw new Error("Invalid exported route type");
    }
  }
}
