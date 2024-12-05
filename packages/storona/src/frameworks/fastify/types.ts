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
