import type { ParsedQs, RouteHandlerType } from "./types";

/**
 * Function to define route in route files. Should be exported as default.
 *
 * @param handler - Request handler.
 * @returns Request handler.
 * @example
 * // routes/!hello.get.mjs
 * import { defineExpressRoute } from "storona";
 *
 * // Optional overrides
 * export const method = "post";
 * export const route = /someregex/; // Can be a string or regex
 *
 * export default defineExpressRoute((_req, res) => {
 *   res.send("Hello world!");
 * });
 * @example
 * // routes/my-fruit.get.ts
 * import { defineExpressRoute } from "storona";
 *
 * interface ReqBody {
 *   fruit: string;
 * }
 *
 * export default defineExpressRoute<ReqBody>((req, res) => {
 *   const { fruit } = req.body;
 *   res.send(`My fruit is ${fruit}!`);
 * });
 */
export function defineExpressRoute<
  ReqBody = any,
  ResBody = any,
  Params = Record<string, string>,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>,
>(
  handler: RouteHandlerType<
    Params,
    ResBody,
    ReqBody,
    ReqQuery,
    Locals
  >,
): RouteHandlerType<Params, ResBody, ReqBody, ReqQuery, Locals> {
  return handler;
}
