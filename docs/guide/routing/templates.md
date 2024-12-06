# Templates

## Rules

One of the essential goals of Storona is to provide readable and maintainable code. To achieve this, we have to follow some rules when creating routes.

There are 4 architecture rules to follow when working with Storona:

- You can define only 1 handler in a single file.
- The handler must be a default export of the file.
- There must be used an appropriate function signature for the handler.
- Files with overriden route or method must start with "!". For example, `apples/!someroute.get.ts`.

## Defining Handler

Handlers are the functions that are executed when a route is matched. Such functions are defined in the route file you're creating.

Each framework has its own handler signature:

::: code-group

```ts:line-numbers [Express]
// routes/other-fruits/apple.get.ts
import { defineExpressRoute } from "storona";

export default defineExpressRoute((_req, res) => {
  res.send("Hello world!");
});
```

```ts:line-numbers [Fastify]
// routes/other-fruits/apple.get.ts
import { defineFastifyRoute } from "storona";

export default defineFastifyRoute((_request, reply) => {
  reply.send("Hello world!");
});
```

:::

This is a design choice to make handler type-safe and to avoid any confusion when working with the routes.

You can also use asynchronous handlers the same way:

::: code-group

```ts:line-numbers [Express]
// routes/other-fruits/apple.get.ts
import { defineExpressRoute } from "storona";

export default defineExpressRoute((_req, res) => { // [!code --]
export default defineExpressRoute(async (_req, res) => { // [!code ++]
  res.send("Hello world!");
});
```

```ts:line-numbers [Fastify]
// routes/other-fruits/apple.get.ts
import { defineFastifyRoute } from "storona";

export default defineFastifyRoute((_request, reply) => { // [!code --]
export default defineFastifyRoute(async (_request, reply) => { // [!code ++]
  reply.send("Hello world!");
});
```

:::

## Overriding Route and Method

[In some cases](/guide/introduction#limitations), you may want to override the route and method of the file-based routing. This can be done by exporting `route` and `method` variables in the route file:

::: code-group

```ts:line-numbers [Express] {5-6}
// routes/other-fruits/!apple.get.ts
import { defineExpressRoute } from "storona";

// Optional overrides
export const method = "post";
export const route = /someregex/; // Can be a string or regex

export default defineExpressRoute((_req, res) => {
  res.send("Hello world!");
});
```

```ts:line-numbers [Fastify] {5-6}
// routes/other-fruits/!apple.get.ts
import { defineFastifyRoute } from "storona";

// Optional overrides
export const method = "post";
export const route = "/example/posts/:id?"; // Can only be a string

export default defineFastifyRoute((_request, reply) => {
  reply.send("Hello world!");
});
```

:::

As you can see, the type and availability of the `route` variable differ between the frameworks. This is due to the nature of the frameworks themselves.

## Use of CommonJS

If you're willing to use CommonJS modules, you can use the following syntax:

::: code-group

```js:line-numbers [Express]
// routes/other-fruits/!apple.get.js
const { defineExpressRoute } = require("storona");

module.exports = {
  method: "post",
  route: /someregex/,
  default: defineExpressRoute((_req, res) => {
    res.send("Hello world!");
  }),
};
```

```js:line-numbers [Fastify]
// routes/other-fruits/!apple.get.js
const { defineFastifyRoute } = require("storona");

module.exports = {
  method: "post",
  route: "/example/posts/:id?",
  default: defineFastifyRoute((_request, reply) => {
    reply.send("Hello world!");
  }),
};
```

:::

::: tip
The use of `default` key is a historical difference between CommonJS and ES modules.
:::
