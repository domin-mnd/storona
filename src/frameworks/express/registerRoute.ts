import type { ParsedImport } from "@/adapter";
import type { Express } from "express";
import type {
  CorrectMethodsType,
  RouteHandlerType,
  RouteType,
} from "./types";

export function registerRoute(
  instance: Express,
  importData: ParsedImport<
    RouteHandlerType,
    CorrectMethodsType,
    RouteType
  >,
): void {
  instance[importData.method](importData.route, importData.handler);
}
