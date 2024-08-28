# Methods

## Supported Methods

Storona supports all HTTP methods that are available in Express and Fastify shorthand functions. This includes:

- Express: `all`, `get`, `post`, `put`, `delete`, `patch`, `options` and `head`
- Fastify: `get`, `post`, `put`, `delete`, `patch`, `options` and `head`

## Dynamic Methods

You can also define dynamic runtime methods using the `method` variable. This is useful when you want to define a method based on a runtime value.

::: code-group

```ts:line-numbers [Express]
// routes/other-fruits/apple.get.ts
import { defineExpressRoute } from "storona";

const randomMethod = Math.random() > 0.5 ? "get" : "post";

export const method = randomMethod;

export default defineExpressRoute((req, res) => {
  res.send("Hello world!");
});
```

```ts:line-numbers [Fastify]
// routes/other-fruits/apple.get.ts
import { defineFastifyRoute } from "storona";

const randomMethod = Math.random() > 0.5 ? "get" : "post";

export const method = randomMethod;

export default defineFastifyRoute((request, reply) => {
  reply.send("Hello world!");
});
```

:::

This code snippet will either register a `GET` or `POST` route based on the random value of `randomMethod`.
