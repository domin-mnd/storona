import type { Bot } from "grammy";
import type { ParsedImport } from "storona/adapter";
import type { Callbacks, Events, H, M, R } from "@/types";
import { CALLBACKS } from "./assert";

/**
 * Register a bot callback or event.
 * It does not utilize composing due to strict return type of createRouter.
 * @param bot - The bot instance.
 * @param importData - The parsed import data.
 */
export function registerCommand(bot: Bot, importData: ParsedImport<H, M, R>) {
  if (
    !Array.isArray(importData.method) &&
    CALLBACKS.includes(importData.method as Callbacks)
  ) {
    const method = importData.method as Callbacks;
    const route = (importData.route as string).substring(1);
    bot[method](
      method === "command" ? route.toString() : (route as string),
      importData.handler,
    );
  } else {
    bot.on(importData.method as Events, importData.handler);
  }
}
