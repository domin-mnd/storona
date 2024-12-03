import type { UnknownAdapter } from "./adapter";
import { logger } from "./router";
import type { RouterOptions } from "./types";

export function assertFileName(
  fileName: string | undefined,
): asserts fileName is string {
  if (!fileName) {
    throw new Error("File name is not provided");
  }
}

export function assertMethod(
  method: string | undefined,
): asserts method is string {
  if (!method) {
    throw new Error("Method is not provided");
  }
}

export function assertAdapter(adapter: UnknownAdapter) {
  const keys = Object.keys(adapter);

  if (
    !keys.includes("validateRoute") ||
    !keys.includes("validateRoutePath") ||
    !keys.includes("registerRoute")
  ) {
    throw new Error("Adapter is missing required methods");
  }
}

export function assertOverrideArchitecturePath(
  options: Required<RouterOptions>,
  path: string,
  pathOverriden: boolean,
): void {
  const pathParts = path.replace(/\\/g, "/").split("/");
  const fileName = pathParts.pop();

  if (
    !options.ignoreWarnings &&
    pathOverriden &&
    !fileName?.startsWith("!")
  ) {
    logger.warn(
      'Files with overriden routes should start with "!", rename the file to',
      `${pathParts.join("/")}/!${fileName}`,
    );
  }
}
