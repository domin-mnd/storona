import type { CorrectImport } from "@/adapter";
import type {
  CorrectMethodsType,
  RouteHandlerType,
  RouteType,
} from "./types";

export const METHODS: CorrectMethodsType[] = [
  "get",
  "post",
  "put",
  "delete",
  "patch",
  "options",
  "head",
];

export function assertExportedVariables(
  route: unknown,
): asserts route is CorrectImport<
  RouteHandlerType,
  CorrectMethodsType,
  RouteType
> {
  if (typeof route !== "object" || route === null) {
    throw new Error("No exports found");
  }

  if ("method" in route) {
    const typeOfMethod = typeof route.method;

    if (
      typeOfMethod !== "string" ||
      !METHODS.includes(route.method as CorrectMethodsType)
    ) {
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

export function assertDefaultImport(
  route: unknown,
): asserts route is CorrectImport<
  RouteHandlerType,
  CorrectMethodsType,
  RouteType
> {
  if (typeof route !== "object" || route === null) {
    throw new Error("No exports found");
  }

  if (!("default" in route)) {
    throw new Error("No default export found");
  }

  if (
    typeof route.default !== "function" &&
    typeof route.default !== "object"
  ) {
    throw new Error("Invalid transpiled default export");
  }

  if (
    typeof route.default === "object" &&
    route.default !== null &&
    !("default" in route.default)
  ) {
    throw new Error("Invalid default export route handler");
  }

  if (typeof route.default?.default !== "function") {
    throw new Error(
      "Default export should be defined with defineRoute",
    );
  }
}

export function validateRoute(
  importData: unknown,
): asserts importData is CorrectImport<
  RouteHandlerType,
  CorrectMethodsType,
  RouteType
> {
  assertExportedVariables(importData);
  if ("default" in importData)
    assertExportedVariables(importData.default);
  assertDefaultImport(importData);
}
