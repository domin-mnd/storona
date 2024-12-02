import type { RouteStructure } from "@/adapter";
import type { CorrectMethodsType } from "./types";

export const METHODS: CorrectMethodsType[] = [
  "get",
  "post",
  "put",
  "delete",
  "patch",
  "options",
  "head",
];

export function assertMethod(
  method: string,
): asserts method is CorrectMethodsType {
  if (!METHODS.includes(method as CorrectMethodsType)) {
    throw new Error(
      "Method must be one of: get, post, put, delete, patch, options, head",
    );
  }
}

export function validateRoutePath(structure: RouteStructure): void {
  assertMethod(structure.method);
}
