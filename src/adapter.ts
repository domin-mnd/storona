import type { RouteStructure } from "./types";

interface ValidResult {
  ok: true;
}

interface InvalidResult {
  ok: false;
  error: Error;
}

export type ValidatorResult = ValidResult | InvalidResult;

interface ImportOrigin<
  RouteHandlerType,
  CorrectMethodsType,
  RouteType,
> {
  default: RouteHandlerType;
  method?: CorrectMethodsType;
  route?: RouteType;
}

export interface CorrectImport<
  RouteHandlerType,
  CorrectMethodsType,
  RouteType,
> extends Omit<
    ImportOrigin<RouteHandlerType, CorrectMethodsType, RouteType>,
    "default"
  > {
  default:
    | ImportOrigin<RouteHandlerType, CorrectMethodsType, RouteType>
    | RouteHandlerType;
}

export interface ParsedImport<
  RouteHandlerType,
  CorrectMethodsType,
  RouteType,
> {
  handler: RouteHandlerType;
  method: CorrectMethodsType;
  route: RouteType;
}

export abstract class FrameworkAdapter<
  RouteHandlerType,
  CorrectMethodsType,
  RouteType,
  InstanceType,
> {
  public constructor(public instance: InstanceType) {
    if (this.constructor === FrameworkAdapter) {
      throw new Error("Cannot instantiate abstract class");
    }
  }

  /** Whether this particular framework is used or not. */
  public static detectFramework(instance: unknown): boolean {
    void instance;
    return false;
  }

  /** Validate given import module object. */
  public validateRoute(
    importData: unknown,
  ): asserts importData is CorrectImport<
    RouteHandlerType,
    CorrectMethodsType,
    RouteType
  > {
    void importData;
  }

  /** Validate route path parsed structure. */
  public validateRoutePath(structure: RouteStructure): void {
    void structure;
  }

  public registerRoute(
    importData: ParsedImport<
      RouteHandlerType,
      CorrectMethodsType,
      RouteType
    >,
  ): void {
    void importData;
    void this.instance;
  }
}
