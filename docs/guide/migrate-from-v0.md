# Migrate From Version 0

## Overview

Storona aims to provide an API that does not change much between versions. However, there are some breaking changes that you should be aware of when migrating from v0 to v1. This guide will help you to migrate your existing codebase to the latest version.

## Explicit Adapter Setting

In v0, you could simply pass an instance and Storona would detect an adapter automatically.

We found this approach to be error-prone and decided to make it explicit in v1.

Since v1, you need to install a separate adapter and set it explicitly for the `createRouter` function:

```ts
import { createRouter } from "storona";
import { adapter } from "@storona/[your-adapter]"; // [!code ++]

createRouter(app, {
  adapter: adapter(), // [!code ++]
});
```

## Removal of `prefix` Option.

In v0, you could set a prefix for all routes by passing the `prefix` option to the `createRouter` function.

Since v1, this option has been removed in favor of web-agnostic routing. Storona aims to be a universal router that can be used in any environment, so we decided to remove this option.

Instead, `@storona/express` and `@storona/fastify` adapters provide the same way of setting a prefix for all routes, but the option should be set inside the adapter itself:

<!-- prettier-ignore-start -->

```ts
import { createRouter } from "storona";
import { adapter } from "@storona/[your-adapter]"; // [!code ++]

createRouter(app, {
  prefix: "/v1", // [!code --]
  adapter: adapter({ // [!code ++]
    prefix: "/v1", // [!code ++]
  }), // [!code ++]
});
```

<!-- prettier-ignore-end -->

## Rename of Signature Functions

In v0, the signature functions were named after the used adapter and its purpose. For example, `defineExpressRoute` was used for the Express adapter.

Since v1, we decided to make the API more consistent and renamed these functions to `define`. This decision was made due to the fact that adapters are now released as separate packages:

<!-- prettier-ignore-start -->
::: code-group

```ts [Express]
import { defineExpressRoute } from "storona"; // [!code --]
import { define } from "@storona/express"; // [!code ++]

export const route = "/hello";
export const method = "get";

export default defineExpressRoute((_req, res) => { // [!code --]
  res.send("Hello, World!"); // [!code --]
}); // [!code --]
export default define((_req, res) => { // [!code ++]
  res.send("Hello, World!"); // [!code ++]
}); // [!code ++]
```

```ts [Fastify]
import { defineFastifyRoute } from "storona"; // [!code --]
import { define } from "@storona/fastify"; // [!code ++]

export const route = "/hello";
export const method = "get";

export default defineFastifyRoute((_request, reply) => { // [!code --]
  reply.send("Hello, World!"); // [!code --]
}); // [!code --]
export default define((_request, reply) => { // [!code ++]
  reply.send("Hello, World!"); // [!code ++]
}); // [!code ++]
```

:::
<!-- prettier-ignore-end -->
