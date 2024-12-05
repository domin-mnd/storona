import { green, red, yellow } from "ansis";
import type { RouterOptions } from "@/types";

export const debug = {
  logs: [] as string[],
  add: (...args: unknown[]) => debug.logs.push(args.join(" ")),
  clear: () => (debug.logs = []),
};

export function info(...args: unknown[]) {
  debug.add(...args);
  console.info(green("▶ "), green.underline("info"), "  ", ...args);
}

export function error(...args: unknown[]) {
  debug.add(...args);
  console.error(red("■ "), red.underline("error"), " ", ...args);
}

export function warn(...args: unknown[]) {
  debug.add(...args);
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
  debug.clear();
  if (options.quiet) return emptyLogger();

  return {
    info,
    error,
    warn,
  };
}

export type Logger = ReturnType<typeof createLogger>;
