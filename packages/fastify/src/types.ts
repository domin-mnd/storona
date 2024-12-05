import type {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface,
  RouteHandlerMethod,
} from "fastify";

export type M =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";

export type H<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
> =
  | RouteHandlerMethod<
      RawServerDefault,
      RawRequestDefaultExpression,
      RawReplyDefaultExpression,
      RouteGeneric
    >
  | Promise<
      RouteHandlerMethod<
        RawServerDefault,
        RawRequestDefaultExpression,
        RawReplyDefaultExpression,
        RouteGeneric
      >
    >;

export type R = string;

export interface Options {
  /**
   * Prefix all routes with a string or an API version.
   * Set to true to use the package version. 1.0.0 -> /v1
   * Set to a string to use a custom prefix.
   * @see {@link https://storona.domin.lol/guide/adapters/fastify#options}
   * @default false
   */
  prefix?: boolean | `/${string}`;
}
