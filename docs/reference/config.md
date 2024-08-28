# Config

## Overview

Configuration of Storona's behavior can be done through the config object passed to the `createRouter` function:

```ts
import { createRouter } from "storona";

createRouter(app, {
  // Config options
});
```

## Directory

By default, Storona will look for routes in the `routes` directory. You can change this by setting the `directory` option:

```ts
import { createRouter } from "storona";

createRouter(app, {
  directory: "src/pages",
});
```

## Prefix

You can add a dynamic prefix to all routes by setting the `prefix` option:

```ts
import { createRouter } from "storona";

createRouter(app, {
  // prefix: false, // Default
  prefix: "/v2",
});
```

::: tip
Setting the `prefix` option to `true` will use the package.json's major version as a prefix. I.e. if the package.json version is `1.2.3`, the prefix will be `/v1`. This is a convenient way to version your API.
:::

## Quiet

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

## Ignore Warnings

To suppress warnings that are logged by Storona, set the `ignoreWarnings` option to `true`:

```ts
import { createRouter } from "storona";

createRouter(app, {
  ignoreWarnings: true,
});
```

This will suppress every non-critical issue that Storona encounters. It is not recommended to use in production.
