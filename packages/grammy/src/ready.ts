import type { Bot } from "grammy";
import type { BotCommand, BotCommandScope, LanguageCode } from "grammy/types";
import type { EndpointInfo } from "storona/adapter";

export const CHAT_SCOPE_REGEX = /^chat:(@[^:]+|\d+)$/g;
export const CHAT_ADMINISTRATORS_SCOPE_REGEX =
  /^chat_administrators:(@[^:]+|\d+)$/g;
export const CHAT_MEMBER_SCOPE_REGEX = /^chat_member:(@[^:]+|\d+):(\d+)$/g;

/**
 * Convert Storona's inline string scope to a BotCommandScope interface from grammy.
 * @param scope - The scope string.
 * @returns The BotCommandScope interface.
 */
function parseScope(scope: string): BotCommandScope {
  switch (scope) {
    case "default":
      return { type: "default" };
    case "all_private_chats":
      return { type: "all_private_chats" };
    case "all_group_chats":
      return { type: "all_group_chats" };
    case "all_chat_administrators":
      return { type: "all_chat_administrators" };
  }

  if (CHAT_SCOPE_REGEX.test(scope)) {
    const id = scope.replace("chat:", "");
    const chat_id = id.startsWith("@") ? id : Number(id);
    return { type: "chat", chat_id };
  }

  if (CHAT_ADMINISTRATORS_SCOPE_REGEX.test(scope)) {
    const id = scope.replace("chat_administrators:", "");
    const chat_id = id.startsWith("@") ? id : Number(id);
    return { type: "chat_administrators", chat_id };
  }

  if (CHAT_MEMBER_SCOPE_REGEX.test(scope)) {
    const [id, user_id] = scope.replace("chat_member:", "").split(":");
    const chat_id = id.startsWith("@") ? id : Number(id);
    return { type: "chat_member", chat_id, user_id: Number(user_id) };
  }

  return { type: "default" };
}

/**
 * Get scope and language code from data.
 * @param data - Data object.
 * @returns Scope and language code.
 */
function getScopeAndLanguage(data: Record<string, unknown>): {
  scope?: BotCommandScope;
  language_code?: LanguageCode;
} {
  const scope = data.scope as string | undefined;
  const language = data.language as string | undefined;
  return {
    scope: scope ? parseScope(scope) : undefined,
    language_code: language as LanguageCode,
  };
}

interface Group {
  commands: BotCommand[];
  scope?: BotCommandScope;
  language_code?: LanguageCode;
}

/**
 * Group commands by their scope and language code
 * @param status - Endpoint status
 * @returns Grouped commands
 */
function groupCommands(status: EndpointInfo[]): Group[] {
  const commands: Group[] = [];

  for (const route of status) {
    if (!route.registered || route.method !== "command") continue;

    const { scope, language_code } = getScopeAndLanguage(route.data);

    const command = {
      command: route.endpoint as string,
      description: route.data.description as string,
    };

    const group = commands.find(
      (group) => group.scope === scope && group.language_code === language_code
    );

    if (group) {
      group.commands.push(command);
    } else {
      commands.push({
        commands: [command],
        scope: scope,
        language_code: language_code,
      });
    }
  }

  return commands;
}

export async function setMyCommands(bot: Bot, status: EndpointInfo[]) {
  for (const group of groupCommands(status)) {
    await bot.api.setMyCommands(group.commands, {
      scope: group.scope,
      language_code: group.language_code,
    });
  }
}
