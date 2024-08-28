import type { RouteHandlerMethod } from "fastify";

export type CorrectMethodsType =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";

export type RouteHandlerType = RouteHandlerMethod;

export type RouteType = string;
