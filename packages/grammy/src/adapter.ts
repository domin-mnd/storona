import type { MethodType, H, M, R, Options } from "@/types";
import {
  assertCommandDescription,
  assertCommandScope,
  assertExportedVariables,
  assertLanguageCode,
  assertMethod,
} from "@/assert";
import type { Bot } from "grammy";
import { createAdapter } from "storona/adapter";
import { parseCommand } from "@/route";
import { setMyCommands } from "@/ready";
import { fallbackOptions } from "@/options";
import { registerCommand } from "@/register";

/**
 * Grammy adapter for Storona. Let's you define events in route files.
 *
 * @see {@link https://grammy.dev/ | Grammy Documentation}
 * @see {@link https://storona.domin.lol/ | Storona Documentation}
 * @see {@link https://storona.domin.lol/guide/adapters/grammy | @storona/grammy Documentation}
 */
export const adapter = createAdapter<H, M, R, Bot, Options>(
  (bot, opts = {}) => {
    // Fallback to default option set
    opts = fallbackOptions(opts);

    return {
      // This is the version of the adapter API. It is used to ensure compatibility.
      // If the adapter API changes, the version should be bumped along with the necessary changes.
      version: "1.0.0",
      on: {
        route(structure) {
          assertMethod(structure.method);

          structure = parseCommand(structure);

          return structure;
        },
        register(importData) {
          if (opts.setMyCommands) {
            assertLanguageCode(importData);
            assertCommandScope(importData);
            assertCommandDescription(importData);
          }
          assertExportedVariables(importData);

          registerCommand(bot, importData);
        },
        async ready(status) {
          if (opts.setMyCommands) await setMyCommands(bot, status);
        },
      },
    };
  },
);

/**
 * Function to define route in route files for type-safe DX. Should be exported as default.
 *
 * @param handler - Route handler method.
 * @returns Route handler method.
 * @example
 * // routes/!hello.hears.mjs
 * import { define } from "@storona/grammy";
 *
 * // Optional overrides
 * export const method = "hears";
 * export const route = /echo *(.+)?/;
 *
 * // Setting context's type explicitly to "hears"
 * export default define<"hears">((ctx) => {
 *   ctx.reply("Hello world!");
 * });
 * @example
 * // routes/start.command.ts
 * import { define } from "@storona/grammy";
 *
 * export default define((ctx) => {
 *   // ctx defaults to Context type if no explicit type provided.
 *   ctx.reply("Hello world!");
 * });
 * @example
 * // routes/!start.message.ts
 * import { define } from "@storona/grammy";
 *
 * // Override to multiple methods per route
 * export const method = ["message:entities:url", "edited_message"];
 *
 * export default define<"message:entities:url" | "edited_message">((ctx) => {
 *   ctx.reply("Hello world!");
 * });
 */
export function define<Q extends MethodType = void>(cb: H<Q>): H<Q> {
  return cb;
}
