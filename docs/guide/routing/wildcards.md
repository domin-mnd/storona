# Wildcards

## Parameters

Route parameters are defined enclosed in square brackets `[]`. For example, `/apples/[id]` will match `/apples/1`, `/apples/2`, and so on. They're automatically remapped to framework-specific parameters:

```
.
└─ src
   ├─ routes
   │  ├─ directory
   │  │  ├─ [fruit].get.js         --> GET  /directory/:fruit
   │  │  ├─ [index].put.mjs        --> PUT  /directory/:index
   │  │  └─ index.put.mjs          --> PUT  /directory
   │  ├─ [fruit]-[weight].post.ts  --> POST /:fruit-:weight
   │  └─ index.get.jsx             --> GET  /
   └─ index.js
```

The usage of parameters is the same as in the framework itself:

::: code-group

```ts:line-numbers [Express]
// routes/other-fruits/[name].get.ts
import { defineExpressRoute } from "storona";

export default defineExpressRoute((req, res) => {
  res.send(`I got ${req.params.name}!`);
});
```

```ts:line-numbers [Fastify]
// routes/other-fruits/[name].get.ts
import { defineFastifyRoute } from "storona";

export default defineFastifyRoute((request, reply) => {
  reply.send(`I got ${request.params.name}!`);
});
```

:::

## Expressions

For more complex routes, you can use expressions defined in overrides. For more information, see [Overriding Route and Method](/guide/routing/templates#overriding-route-and-method).
