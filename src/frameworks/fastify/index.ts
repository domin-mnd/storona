import {
  type CorrectImport,
  FrameworkAdapter,
  type ParsedImport,
  type RouteStructure,
} from "@/adapter";
import type { FastifyInstance } from "fastify";
import { detectFramework } from "./detectFramework";
import { registerRoute } from "./registerRoute";
import type {
  CorrectMethodsType,
  RouteHandlerType,
  RouteType,
} from "./types";
import { validateRoute } from "./validateRoute";
import { validateRoutePath } from "./validateRoutePath";

export class FastifyAdapter extends FrameworkAdapter<
  RouteHandlerType,
  CorrectMethodsType,
  RouteType,
  FastifyInstance
> {
  public static detectFramework(instance: unknown): boolean {
    return detectFramework(instance);
  }

  public validateRoute(
    importData: unknown,
  ): asserts importData is CorrectImport<
    RouteHandlerType,
    CorrectMethodsType,
    RouteType
  > {
    return validateRoute(importData);
  }

  public validateRoutePath(structure: RouteStructure): void {
    return validateRoutePath(structure);
  }

  public registerRoute(
    importData: ParsedImport<
      RouteHandlerType,
      CorrectMethodsType,
      RouteType
    >,
  ): void {
    return registerRoute(this.instance, importData);
  }
}
