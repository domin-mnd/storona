import { readFileSync, readdirSync } from "fs";
import { isAbsolute, join, normalize, relative, resolve } from "path";
import { build } from "tsup";
import type {
  DeabstractedAdapter,
  FrameworkAdapter,
  UnknownAdapter,
} from "./adapter";
import { adapters } from "./frameworks";
import type { RouteStructure, RouterOptions } from "./types";
import { assertMethod } from "./validate";
import { ExpressAdapter } from "./frameworks/express";
import { FastifyAdapter } from "./frameworks/fastify";

export const BUILD_DIR = resolve("node_modules/.cache/storona");

/**
 * Check if code is running in bun environment.
 * @see {@link https://bun.sh/guides/util/detect-bun | Detect Bun}
 * @returns True if running in bun.
 */
export function isBun(): boolean {
  return !!process.versions.bun;
}

/**
 * Get files in directory.
 * @param dir - Path to directory.
 * @returns File path.
 * @example
 * getFiles("routes") == ["routes/some/route.get.js", "routes/some/very/nested/endpoint.post.js"]
 */
export function* getFiles(dir: string): Generator<string> {
  const files = readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const yieldValue = join(dir, file.name);

    if (file.isDirectory()) {
      yield* getFiles(yieldValue);
    } else {
      yield yieldValue;
    }
  }
}

let packageJson: Record<string, unknown> | null | undefined;

/**
 * Get package.json.
 * @returns Package.json content. Null if not found.
 */
export function getPackageJson(): Record<string, unknown> | null {
  try {
    return JSON.parse(
      readFileSync(join(process.cwd(), "package.json"), "utf-8"),
    );
  } catch {
    return null;
  }
}

/**
 * Get project format from package.json.
 * @returns Project format. "cjs" or "esm".
 */
export function getProjectFormat(): "cjs" | "esm" {
  if (packageJson === undefined) {
    packageJson = getPackageJson();
  }

  if (!packageJson) return "cjs";

  return "type" in packageJson &&
    typeof packageJson.type === "string" &&
    packageJson.type === "module"
    ? "esm"
    : "cjs";
}

/**
 * Get package version from package.json.
 * @returns Package version.
 * @example
 * getPackageVersion() == "1.6.7" // If package.json has version 1.6.7
 * getPackageVersion() == "1.0.0" // If there is no version in package.json or package.json is not found
 */
export function getPackageVersion(): string {
  if (packageJson === undefined) {
    packageJson = getPackageJson();
  }

  if (!packageJson) return "1.0.0";

  return "version" in packageJson &&
    typeof packageJson.version === "string"
    ? packageJson.version
    : "1.0.0";
}

export function getPrefix(prefix: `/${string}` | true): string {
  return typeof prefix === "string"
    ? prefix
    : `/v${getPackageVersion().split(".")[0]}`;
}

/**
 * Get structure from file path.
 * @param path - Path to file.
 * @example
 * dist/routes/some/route.get.ts == endpoint: "/v1/some/route", method: "get"
 * dist/routes/some/very/nested/endpoint.post.js == endpoint: "/v1/some/very/nested/endpoint", method: "post"
 * dist/routes/index.put.jsx == endpoint: "/v1", method: "put"
 */
export function getStructure(
  options: Required<RouterOptions>,
  path: string,
): RouteStructure {
  path = path.replace(/\\/g, "/");

  const pathParts = path.split(".");
  // Remove extension
  pathParts.pop();
  const method = pathParts.pop();

  assertMethod(method);
  if (pathParts[pathParts.length - 1].endsWith("/")) {
    throw new Error("Route names should not start with a dot");
  }

  const endpoint = pathParts.join(".");

  const directoryPrefix = `${normalize(options.directory)
    .replace(/\\/g, "/")
    .replace(/\/$/, "")}/`;

  // Remove directory prepend as well as replace \ with / (windows)
  const normalizedEndpoint = endpoint
    .replace(/\[(.*?)\]/g, ":$1")
    .replace(directoryPrefix, "")
    // Remap some/nested/index to some/nested
    // And some/nested/:index to some/nested/:index
    .replace(/(?<!:)index$/g, "")
    .replace(/\/$/g, "");

  const prefix =
    options.prefix === false ? "" : getPrefix(options.prefix);

  // /prefix + route +
  // "" + route +
  // "" + "" +
  // /prefix + "" -

  // Joining slash for prefix
  const slash = prefix !== "" && normalizedEndpoint === "" ? "" : "/";

  return {
    endpoint: `${prefix}${slash}${normalizedEndpoint}`,
    method,
  };
}

/**
 * Transpile routes to cjs in node_modules/.cache/storona.
 * @param options - Required router options.
 */
export async function buildRouter(options: Required<RouterOptions>) {
  // Don't transpile when running in bun
  if (isBun()) return;

  await build({
    entry: [
      join(process.cwd(), options.directory).replace(/\\/g, "/"),
    ],
    outDir: join(BUILD_DIR, options.directory),
    splitting: true,
    format: getProjectFormat(),
    silent: true,
    bundle: true,
    outExtension: () => ({
      js: ".js",
      dts: ".d.ts",
    }),
    dts: false,
    clean: true,
  });
}

const ADAPTER_TABLE: Record<
  string,
  typeof FrameworkAdapter<any, any, any, any>
> = {
  express: ExpressAdapter,
  fastify: FastifyAdapter,
};

/**
 * Get framework adapter by its explicity name in the table.
 * @param name - Adapter name.
 * @param instance - Framework instance to use.
 * @returns Adapter instance.
 */
export function getAdapterByName(
  name: unknown,
  instance: unknown,
): UnknownAdapter | undefined {
  if (typeof name !== "string") {
    return undefined;
  }

  const Adapter = ADAPTER_TABLE[name] as unknown as
    | DeabstractedAdapter
    | undefined;

  if (!Adapter) {
    throw new Error(`Framework adapter "${name}" not found`);
  }

  return new Adapter(instance);
}

/**
 * Detect framework adapter using static detectFramework method.
 * @param instance - Framework instance to use.
 * @returns Adapter instance.
 */
export function detectAdapter(instance: unknown): UnknownAdapter {
  const Adapter = adapters.find(adapter =>
    adapter.detectFramework(instance),
  ) as DeabstractedAdapter | undefined;

  if (!Adapter) {
    throw new Error("Could not detect framework adapter");
  }

  return new Adapter(instance);
}

export function defineOptions(
  router?: RouterOptions | string,
): RouterOptions {
  const options =
    typeof router === "string"
      ? { directory: router }
      : (router ?? {});

  if (options.directory)
    options.directory = isAbsolute(options.directory)
      ? relative(process.cwd(), options.directory)
      : options.directory;

  return options;
}

export function fallbackOptions(
  options: RouterOptions,
): Required<RouterOptions> {
  return {
    directory: "routes",
    prefix: false,
    quiet: false,
    ignoreWarnings: false,
    adapter: "express",
    ...options,
  };
}
