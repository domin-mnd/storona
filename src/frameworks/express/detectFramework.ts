import type { Express } from "express";

export function detectFramework(
  instance: unknown,
): instance is Express {
  if (typeof instance !== "function" || instance === null)
    return false;

  return instance.name === "app";
}
