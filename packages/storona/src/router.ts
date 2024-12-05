import {
  flattenExports,
  getHandler,
  getImport,
  getMethod,
  getRoute,
} from "@/import";
import { type Logger, createLogger } from "@/logger";
import { normalizeManualRoute } from "@/normalize";
import type { EndpointInfo, RouterOptions } from "@/types";
import {
  buildRouter,
  defineOptions,
  fallbackOptions,
  getFiles,
  getStructure,
  undefinedAdapter,
} from "@/utils";
import type { Adapter, RouteStructure } from "@/adapter";
import { assertHandler } from "@/validate";

// Functions aren't pure to avoid repetitive code
export let logger: Logger;

/**
 * Register endpoints relative to file system.
 * Automatically transpiles esm, jsx & ts to cjs.
 *
 * @see {@link https://storona.domin.lol}
 * @param app - Your framework instance. Supported frameworks: Express, Fastify.
 * @returns Status of each found endpoint.
 * @example
 * import express from "express";
 * import { createRouter } from "storona";
 * import { adapter } from "@storona/express";
 * import cors from "cors";
 *
 * function createServer() {
 *   const app = express();
 *   app.use(cors());
 *
 *   return app;
 * }
 *
 * const server = createServer();
 *
 * createRouter(server, {
 *   directory: "src/routes",
 *   // Set to true to use the package version. 1.0.0 -> /v1
 *   prefix: "/v1/api",
 *   adapter: adapter(),
 *   quiet: false,
 * });
 *
 * server.listen(3000, () => {
 *   console.info("API running on port 3000");
 * });
 * @example
 * import fastify from "fastify";
 * import { createRouter } from "storona";
 * import { adapter } from "@storona/fastify";
 *
 * function createServer() {
 *   const app = fastify();
 *   return app;
 * }
 *
 * const server = createServer();
 *
 * createRouter(server, {
 *   directory: "src/routes",
 *   // Set to true to use the package version. 1.0.0 -> /v1
 *   prefix: "/v1/api",
 *   quiet: false,
 *   adapter: adapter(),
 * });
 *
 * server.listen(
 *   {
 *     port: 3000,
 *   },
 *   () => {
 *     console.info("API running on port 3000");
 *   }
 * );
 */
export async function createRouter<T>(
  app: T,
  options?: RouterOptions
): Promise<EndpointInfo[]>;
export async function createRouter<T>(
  app: T,
  directory?: string
): Promise<EndpointInfo[]>;
export async function createRouter<T>(
  app: T,
  router?: RouterOptions | string
): Promise<EndpointInfo[]> {
  const endpointStatus: EndpointInfo[] = [];

  // Define required options
  const definition = defineOptions(router);
  const options = fallbackOptions(definition);

  logger = createLogger(options);

  if (options.directory.endsWith("/")) {
    logger.error(
      "Routes directory should not end with a slash, skipping router registration"
    );
    return endpointStatus;
  }

  let adapter: Adapter<any, any, any>;
  try {
    adapter = definition.adapter?.(app) ?? undefinedAdapter()(app);
    await adapter.on.init?.();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        `Failed to instantiate adapter: ${(error as Error).message}`
      );
    } else {
      logger.error(`Unknown error while instantiating adapter: ${error}`);
    }
    return endpointStatus;
  }

  // Build the whole router directory
  await buildRouter(options);

  for (const file of getFiles(options.directory)) {
    let importData: unknown;
    let structure: RouteStructure;

    try {
      importData = flattenExports(await getImport(file));
      assertHandler(importData);

      structure = getStructure(options, file);
      structure = (await adapter.on.route?.(structure)) ?? structure;
    } catch (error) {
      endpointStatus.push({
        path: file,
        registered: false,
        error: error as Error,
      });
      if (error instanceof Error) {
        logger.error(`Failed to register ${file}: ${(error as Error).message}`);
      } else {
        logger.error(`Unknown error while registering ${file}: ${error}`);
      }
      continue;
    }

    const { endpoint, method } = structure;
    const manualEndpoint = normalizeManualRoute(getRoute(importData));
    const manualMethod = getMethod(importData);

    const setMethod = manualMethod ?? method;
    const setEndpoint = manualEndpoint ?? endpoint;

    try {
      await adapter.on.register({
        handler: getHandler(importData),
        method: setMethod,
        route: setEndpoint,
        data: importData as any,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          `Failed to register ${setEndpoint}: ${(error as Error).message}`
        );
      } else {
        logger.error(
          `Unknown error while registering ${setEndpoint}: ${error}`
        );
      }
      endpointStatus.push({
        path: file,
        registered: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
      continue;
    }

    logger.info(`Registered ${setMethod.toString().toUpperCase()} ${setEndpoint}`);
    endpointStatus.push({
      path: file,
      endpoint: setEndpoint,
      method: setMethod,
      registered: true,
      data: importData as any,
    });
  }

  try {
    await adapter.on.ready?.(endpointStatus);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to run ready hook: ${(error as Error).message}`);
    } else {
      logger.error(`Unknown error while running ready hook: ${error}`);
    }
  }
  return endpointStatus;
}
