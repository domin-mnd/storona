import type { Options } from "@/types";

export function fallbackOptions(options: Options): Required<Options> {
  return {
    setMyCommands: true,
    ...options,
  };
}
