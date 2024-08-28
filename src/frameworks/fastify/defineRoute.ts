import type { RouteHandlerType } from "./types";

/**
 * Function to define route in route files. Should be exported as default.
 *
 * @param handler - Route handler method.
 * @returns Route handler method.
 * @example
 * import { defineFastifyRoute } from "storona";
 *
 * // Optional overrides
 * export const method = "post";
 * export const route = "/valid/:route";
 *
 * export default defineFastifyRoute((_request, reply) => {
 *   reply.send("Hello world!");
 * });
 */
export function defineFastifyRoute<
  T extends RouteHandlerType | Promise<RouteHandlerType>,
>(handler: T): T {
  return handler;
}
