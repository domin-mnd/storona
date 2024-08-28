import { join } from "path";
import { pathToFileURL } from "url";
import type { RequestHandler } from "express";
import { BUILD_DIR } from "./utils";

export function getImport(filePath: string): Promise<unknown> {
  const fileParts = filePath.split(".");
  fileParts[fileParts.length - 1] = "js";

  const outFile = join(BUILD_DIR, fileParts.join("."));

  return import(pathToFileURL(outFile).toString());
}

export function getHandler(importData: any): RequestHandler {
  if (typeof importData.default === "function") {
    return importData.default;
  }

  return importData.default.default;
}

export function getMethod(importData: any): any | undefined {
  if ("method" in importData.default) {
    return importData.default.method;
  }

  return importData.method;
}

export function getRoute(importData: any): any | undefined {
  if ("route" in importData.default) {
    return importData.default.route;
  }

  return importData.route;
}
