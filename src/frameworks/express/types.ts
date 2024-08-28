import type { RequestHandler } from "express";

export type CorrectMethodsType =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";

export type RouteHandlerType = RequestHandler;

export type RouteType = string;
