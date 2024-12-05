![Preview banner](public/preview-banner.png)

<h1>
  Overview
  <sup>
    <strong>
      <code>&nbsp;<a href="https://storona.domin.lol/guide/adapters/grammy/">Documentation</a>&nbsp;</code>
    </strong>
  </sup>
</h1>

This package is an adapter for [storona](https://storona.domin.lol/) file-based router. It allows to use [grammY](https://grammy.dev/) telegram bot framework with storona.

> Regarding all features and caveats, please refer to the documentation.

# Install

```bash
$ npm install storona grammy @storona/grammy
$ yarn add storona grammy @storona/grammy
$ pnpm add storona grammy @storona/grammy
$ bun i storona grammy @storona/grammy
```

# Usage

To use this adapter you need to create a bot instance and pass it to the router. Then you can use the router as intended by storona design:

```typescript
import { Bot } from "grammy";
import { createRouter } from "storona";
import { adapter } from "@storona/grammy";

const bot = new Bot("YOUR TOKEN");

// Await the router initialization first
await createRouter(bot, {
  directory: "src/routes",
  adapter: adapter({
    // It will automatically set commands for you
    setMyCommands: true,
  }),
});

bot.start();
```

## Result

```
.
└─ src
   ├─ routes
   │  ├─ directory
   │  │  ├─ help.command.ts          --> COMMAND  /help
   │  │  └─ index.inline_query.mjs   --> INLINE_QUERY
   │  ├─ apple.message.js            --> MESSAGE
   │  └─ index.hears.jsx             --> HEARS
   └─ index.js
```

## Route Example

```typescript
// src/routes/directory/help.command.ts
import { define } from "@storona/grammy";

// setMyCommands' description
export const description = "Command description";
// setMyCommands' scope
export const scope = "chat:@dominnya";
// setMyCommands' language_code
export const language = "en";

// Explicitly define context type by providing it as a generic, otherwise it would default to Context
export default define<"command">(async (ctx) => {
  await ctx.reply("Hello, world!");
});
```

# License

This project is under [MIT](https://choosealicense.com/licenses/mit/) license. You can freely use it for your own purposes.
