import type { Express } from "express";
import type { FastifyInstance } from "fastify";
import { getHandler, getImport, getMethod, getRoute } from "./import";
import { type Logger, createLogger } from "./logger";
import { normalizeManualRoute } from "./normalize";
import type { EndpointInfo, RouterOptions } from "./types";
import {
  buildRouter,
  defineOptions,
  detectAdapter,
  fallbackOptions,
  getAdapterByName,
  getFiles,
  getStructure,
} from "./utils";
import type { RouteStructure, UnknownAdapter } from "./adapter";

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
 *   adapter: "express", // Optional, detected automatically
 *   quiet: false,
 * });
 *
 * server.listen(3000, () => {
 *   console.info("API running on port 3000");
 * });
 * @example
 * import fastify from "fastify";
 * import { createRouter } from "storona";
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
export async function createRouter(
  app: Express | FastifyInstance,
  options?: RouterOptions,
): Promise<EndpointInfo[]>;
export async function createRouter(
  app: Express | FastifyInstance,
  directory?: string,
): Promise<EndpointInfo[]>;
export async function createRouter(
  app: Express | FastifyInstance,
  router?: RouterOptions | string,
): Promise<EndpointInfo[]> {
  const endpointStatus: EndpointInfo[] = [];

  // Define required options
  const definition = defineOptions(router);
  const options = fallbackOptions(definition);

  logger = createLogger(options);

  if (options.directory.endsWith("/")) {
    logger.error(
      "Routes directory should not end with a slash, skipping router registration",
    );
    return endpointStatus;
  }

  let adapter: UnknownAdapter;
  try {
    adapter =
      getAdapterByName(definition.adapter, app) ?? detectAdapter(app);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        `Failed to instantiate adapter: ${(error as Error).message}`,
      );
    } else {
      logger.error(
        `Unknown error while instantiating adapter: ${error}`,
      );
    }
    return endpointStatus;
  }

  // Build the whole router directory
  await buildRouter(options);

  for (const file of getFiles(options.directory)) {
    let importData: unknown;
    let structure: RouteStructure;

    try {
      importData = await getImport(file);
      structure = getStructure(options, file);
      adapter.validateRoute(importData);
      adapter.validateRoutePath(structure);
    } catch (error) {
      endpointStatus.push({
        path: file,
        registered: false,
        error: error as Error,
      });
      if (error instanceof Error) {
        logger.error(
          `Failed to register ${file}: ${(error as Error).message}`,
        );
      } else {
        logger.error(
          `Unknown error while registering ${file}: ${error}`,
        );
      }
      continue;
    }

    const { endpoint, method } = structure;
    const manualEndpoint = normalizeManualRoute(getRoute(importData));
    const manualMethod = getMethod(importData);

    const setMethod = manualMethod ?? method;
    const setEndpoint = manualEndpoint ?? endpoint;

    try {
      adapter.registerRoute({
        handler: getHandler(importData),
        method: setMethod,
        route: setEndpoint,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          `Failed to register route ${setEndpoint}: ${(error as Error).message}`,
        );
      } else {
        logger.error(
          `Unknown error while registering route ${setEndpoint}: ${error}`,
        );
      }
    }

    logger.info(
      `Registered ${setMethod.toUpperCase()} ${setEndpoint}`,
    );
    endpointStatus.push({
      path: file,
      endpoint: setEndpoint,
      method: setMethod,
      registered: true,
    });
  }

  return endpointStatus;
}
