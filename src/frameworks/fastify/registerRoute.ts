import type { ParsedImport } from "@/adapter";
import type { FastifyInstance } from "fastify";
import type {
  CorrectMethodsType,
  RouteHandlerType,
  RouteType,
} from "./types";

export function registerRoute(
  instance: FastifyInstance,
  importData: ParsedImport<
    RouteHandlerType,
    CorrectMethodsType,
    RouteType
  >,
): void {
  // @ts-expect-error Ignore promise wrapping
  instance[importData.method](importData.route, importData.handler);
}
