# Config

## Overview

Configuration of Storona's behavior can be done through the config object passed to the `createRouter` function:

```ts
import { createRouter } from "storona";

createRouter(app, {
  // Config options
});
```

## Adapter <Badge type="info" text="Since v1" />

To set an adapter that will manipulate the provided instance, set the `adapter` option:

```ts
import { createRouter } from "storona";
import { adapter } from "@storona/[your-adapter]";

createRouter(app, {
  adapter: adapter(),
});
```

## Directory <Badge type="info" text="Since v0" />

By default, Storona will look for routes in the `routes` directory. You can change this by setting the `directory` option:

```ts
import { createRouter } from "storona";

createRouter(app, {
  directory: "src/pages",
});
```

## Quiet <Badge type="info" text="Since v0" />

To suppress logger completely, set the `quiet` option to `true`:

```ts
import { createRouter } from "storona";

createRouter(app, {
  quiet: true,
});
```

Alternatively `createRouter` returns registered and unregistered routes with their corresponding errors. This can be useful for debugging and making own logging system:

```ts
import { createRouter } from "storona";

// Top-level await is only available in ES modules
const routes = await createRouter(app, {
  quiet: true,
});

console.log(routes);
/*
[
  {
    path: 'src\\routes\\some\\overriden\\route.post.ts',
    registered: false,
    error: Error: Invalid exported method type
  },
  {
    path: 'src\\routes\\other-fruits\\[index].get.ts',
    endpoint: '/other-fruits/:index',
    method: 'get',
    registered: true
  },
  {
    path: 'src\\routes\\[index.get].tsx',
    registered: false,
    error: Error: Method must be one of: get, post, put, delete, patch, options, head
  }
]
*/
```

## Ignore Warnings <Badge type="info" text="Since v0" />

To suppress warnings that are logged by Storona, set the `ignoreWarnings` option to `true`:

```ts
import { createRouter } from "storona";

createRouter(app, {
  ignoreWarnings: true,
});
```

This will suppress every non-critical issue that Storona encounters. It is not recommended to use in production.
