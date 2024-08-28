import type { RouteStructure } from "@/types";
import type { CorrectMethodsType } from "./types";

export const METHODS: CorrectMethodsType[] = [
  "all",
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
      "Method must be one of: all, get, post, put, delete, patch, options, head",
    );
  }
}

export function validateRoutePath(structure: RouteStructure): void {
  assertMethod(structure.method);
}
