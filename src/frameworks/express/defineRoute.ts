import type { RouteGeneric, RouteHandlerType } from "./types";

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
 * export default defineExpressRoute<{
 *   ReqBody: ReqBody;
 * }>((req, res) => {
 *   const { fruit } = req.body;
 *   res.send(`My fruit is ${fruit}!`);
 * });
 */
export function defineExpressRoute<
  Route extends RouteGeneric = RouteGeneric,
>(
  handler: RouteHandlerType<
    Route["Params"],
    Route["ResBody"],
    Route["ReqBody"],
    Route["ReqQuery"],
    Route["Locals"] & Record<string, any>
  >,
): RouteHandlerType<
  Route["Params"],
  Route["ResBody"],
  Route["ReqBody"],
  Route["ReqQuery"],
  Route["Locals"] & Record<string, any>
> {
  return handler;
}
