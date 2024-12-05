import type { ParsedImport } from "storona/adapter";
import type { FastifyInstance } from "fastify";
import type { M, H, R } from "./types";

export function registerRoute(
  instance: FastifyInstance,
  importData: ParsedImport<H, M, R>
): void {
  // @ts-expect-error Ignore promise wrapping
  instance[importData.method](importData.route, importData.handler);
}
