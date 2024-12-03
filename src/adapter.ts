interface ImportOrigin<
  RouteHandlerType,
  CorrectMethodsType,
  RouteType,
> {
  default: RouteHandlerType;
  method?: CorrectMethodsType;
  route?: RouteType;
}

export interface RouteStructure {
  endpoint: string;
  method: string;
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
  /** Callback provided by defineXRoute of an adapter. */
  handler: RouteHandlerType;
  /** Overriden method in case provided. */
  method: CorrectMethodsType;
  /** Overriden route in case provided. */
  route: RouteType;
  /** Original import data. */
  data: Record<string, unknown>;
}

export type UnknownAdapter = FrameworkAdapter<any, any, any, any>;

export interface DeabstractedAdapter {
  new (instance: unknown): UnknownAdapter;
}

interface AdapterOptions<
  RouteHandlerType,
  CorrectMethodsType,
  RouteType,
> {
  /** Validate given import module object. */
  validateRoute: (
    importData: unknown,
  ) => asserts importData is CorrectImport<
    RouteHandlerType,
    CorrectMethodsType,
    RouteType
  >;
  /** Validate route path parsed structure. */
  validateRoutePath: (structure: RouteStructure) => void;
  /** Register route to the framework. */
  registerRoute: (
    importData: ParsedImport<
      RouteHandlerType,
      CorrectMethodsType,
      RouteType
    >,
  ) => void;
}

/**
 * Create an adapter for storona's route handling system.
 * @param adapter - Adapter options.
 * @returns Adapter class that is initialized within createRouter function.
 * @example
 * ```ts
 * import { createAdapter } from "storona/adapter";
 * import type { Express } from "express";
 *
 * export const Adapter = createAdapter<(req, res) => void, "get" | "post", string, Express>((instance) => ({
 *   validateRoute: (importData) => {
 *     throw "Error";
 *   },
 *   validateRoutePath: (structure) => {
 *     throw "Error";
 *   },
 *   registerRoute: (importData) => {
 *     // Dummy example
 *     instance.get("/new-route", importData.handler);
 *   },
 * }));
 * ```
 */
export function createAdapter<
  RouteHandlerType,
  CorrectMethodsType,
  RouteType,
  InstanceType,
>(
  adapter: (
    instance: InstanceType,
  ) => AdapterOptions<
    RouteHandlerType,
    CorrectMethodsType,
    RouteType
  >,
) {
  return class Adapter extends FrameworkAdapter<
    RouteHandlerType,
    CorrectMethodsType,
    RouteType,
    InstanceType
  > {
    public constructor(instance: InstanceType) {
      super(instance);
      const options = adapter(instance);
      this.validateRoute = options.validateRoute;
      this.validateRoutePath = options.validateRoutePath;
      this.registerRoute = options.registerRoute;
    }
  };
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

  /** Register route to the framework. */
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
