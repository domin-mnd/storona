import type { Options } from "@/types";

export function fallbackOptions(options: Options): Required<Options> {
  return {
    prefix: false,
    ...options,
  };
}
