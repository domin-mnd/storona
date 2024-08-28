import type { RouteHandlerType } from "./types";

/**
 * Function to define route in route files. Should be exported as default.
 *
 * @param handler - Request handler.
 * @returns Request handler.
 * @example
 * import { defineExpressRoute } from "storona";
 *
 * // Optional overrides
 * export const method = "post";
 * export const route = /someregex/; // Can be a string or regex
 *
 * export default defineExpressRoute((_req, res) => {
 *   res.send("Hello world!");
 * });
 */
export function defineExpressRoute<
  T extends RouteHandlerType | Promise<RouteHandlerType>,
>(handler: T): T {
  return handler;
}
