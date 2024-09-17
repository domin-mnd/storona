import type { RouteGenericInterface } from "fastify";
import type { RouteHandlerType } from "./types";

/**
 * Function to define route in route files. Should be exported as default.
 *
 * @param handler - Route handler method.
 * @returns Route handler method.
 * @example
 * // routes/!hello.get.mjs
 * import { defineFastifyRoute } from "storona";
 *
 * // Optional overrides
 * export const method = "post";
 * export const route = "/valid/:route";
 *
 * export default defineFastifyRoute((_request, reply) => {
 *   reply.send("Hello world!");
 * });
 * @example
 * // routes/my-fruit.get.ts
 * import { defineFastifyRoute } from "storona";
 *
 * interface ReqBody {
 *   fruit: string;
 * }
 *
 * export default defineFastifyRoute<{
 *   Body: ReqBody;
 * }>((req, res) => {
 *   const { fruit } = req.body;
 *   res.send(`My fruit is ${fruit}!`);
 * });
 */
export function defineFastifyRoute<
  RouteGeneric extends RouteGenericInterface,
>(
  handler: RouteHandlerType<RouteGeneric>,
): RouteHandlerType<RouteGeneric> {
  return handler;
}
