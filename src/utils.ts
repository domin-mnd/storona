import { readFileSync, readdirSync } from "fs";
import { isAbsolute, join, normalize, relative, resolve } from "path";
import { build } from "tsup";
import type { FrameworkAdapter } from "./adapter";
import { adapters } from "./frameworks";
import type { RouteStructure, RouterOptions } from "./types";
import { assertMethod } from "./validate";

export const BUILD_DIR = resolve("node_modules/.cache/storona");

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
 * Get package version from package.json.
 * @returns Package version.
 * @example
 * getPackageVersion() == "1.6.7" // If package.json has version 1.6.7
 * getPackageVersion() == "1.0.0" // If there is no version in package.json or package.json is not found
 */
export function getPackageVersion(): string {
  if (packageJson === undefined) {
    try {
      packageJson = JSON.parse(
        readFileSync(join(process.cwd(), "package.json"), "utf-8"),
      );
    } catch {
      packageJson = null;
    }
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
  await build({
    entry: [
      join(process.cwd(), options.directory).replace(/\\/g, "/"),
    ],
    outDir: join(BUILD_DIR, options.directory),
    splitting: true,
    format: "cjs",
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

export type UnknownAdapter = FrameworkAdapter<any, any, any, any>;
interface DeabstractedAdapter {
  new (instance: unknown): UnknownAdapter;
}

export function detectAdapter(instance: unknown): UnknownAdapter {
  const Adapter = adapters.find(adapter =>
    adapter.detectFramework(instance),
  ) as DeabstractedAdapter | undefined;

  if (!Adapter) {
    throw new Error("Framework adapter not found");
  }

  return new Adapter(instance);
}

export function defineOptions(
  router?: RouterOptions | string,
): RouterOptions {
  const options =
    typeof router === "string" ? { directory: router } : router ?? {};

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
    ...options,
  };
}
