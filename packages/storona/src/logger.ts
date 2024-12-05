import { green, red, yellow } from "ansis";
import type { RouterOptions } from "@/types";

export function info(...args: unknown[]) {
  console.info(green("▶ "), green.underline("info"), "  ", ...args);
}

export function error(...args: unknown[]) {
  console.error(red("■ "), red.underline("error"), " ", ...args);
}

export function warn(...args: unknown[]) {
  console.warn(yellow("● "), yellow.underline("warn"), "  ", ...args);
}

function emptyLogger() {
  return {
    info: () => {},
    error: () => {},
    warn: () => {},
  };
}

export function createLogger(options: Required<RouterOptions>) {
  if (options.quiet) return emptyLogger();

  return {
    info,
    error,
    warn,
  };
}

export type Logger = ReturnType<typeof createLogger>;
