import type { RequestHandler } from "express";

export type M =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";

export interface ParsedQs {
  [key: string]:
    | undefined
    | string
    | string[]
    | ParsedQs
    | ParsedQs[];
}

export interface RouteGeneric {
  Params?: Record<string, string>;
  ResBody?: any;
  ReqBody?: any;
  ReqQuery?: ParsedQs;
  Locals?: Record<string, any>;
}

export type H<
  Params = Record<string, string>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>,
> =
  | RequestHandler<Params, ResBody, ReqBody, ReqQuery, Locals>
  | Promise<
      RequestHandler<Params, ResBody, ReqBody, ReqQuery, Locals>
    >;

export type R = string;
