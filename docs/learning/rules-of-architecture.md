# Rules Of Architecture

## Overview

Storona does not provide any functionality for validating exports per se, however it enforces certain file structure rules to ensure that the codebase is maintainable and readable.

Rules of architecture are a set of guidelines that should be followed when creating a new file. These rules are enforced by the parsing engine and will result in a warn or error if not followed.

## Rules

### Handler Definition

You can define only 1 handler in a single file.

This rule is enforced to ensure that the file is not cluttered with multiple handlers. This makes it easier to maintain and read the codebase.

<div class="danger custom-block">

<p class="custom-block-title">ERROR</p>

::: code-group

```ts [routes/greeting.post.ts]
import { define } from "@storona/express";

const validateAuth = define((_req, res) => {
  // ...
});

const getBody = define((req, res) => {
  return req.body;
});

export default define((req, res) => {
  validateAuth(req, res);

  const body = getBody(req, res);

  res.send(`Hello ${body.name}!`);
});
```

:::

</div>

<div class="success custom-block">

<p class="custom-block-title">OK</p>

::: code-group

```ts [routes/greeting.post.ts]
import { define } from "@storona/express";
import { getBody } from "../utils/getBody";

export default define((req, res) => {
  const body = getBody(req);

  res.send(`Hello ${body.name}!`);
});
```

```ts [utils/getBody.ts]
import type { Request } from "express";

export function getBody(req: Request) {
  return req.body;
}
```

```ts [middleware/auth.ts]
import { app } from "..";

app.use((_req, res, next) => {
  // ...
  next();
});
```

:::

</div>

### Default Export

The handler must be an unnamed default export of the file.

This rule is enforced to ensure that the handler is easily accessible when reading the code. This makes it easier to work with the contents of a route.

<div class="danger custom-block">

<p class="custom-block-title">ERROR</p>

::: code-group

```ts [routes/index.get.ts]
import { define } from "@storona/express";

const handler = define((req, res) => {
  res.send("Hello world!");
});

export default handler;
```

:::

</div>

<div class="success custom-block">

<p class="custom-block-title">OK</p>

::: code-group

```ts [routes/index.get.ts]
import { define } from "@storona/express";

export default define((req, res) => {
  res.send("Hello world!");
});
```

:::

</div>

### Function Signature

There must be used an appropriate function signature for the handler.

> [!NOTE]
> Function signatures are wrappers around the handler function that provide strict type checking. This ensures that the handler is correctly defined and that the codebase is maintainable.

This rule is enforced to ensure better DX and less boilerplate. It also helps to avoid any confusion when working with the routes.

<div class="danger custom-block">

<p class="custom-block-title">ERROR</p>

::: code-group

```ts [routes/index.get.ts]
import type { Request, Response } from "express";

export default (req: Request, res: Response) => {
  res.send("Hello world!");
};
```

:::

</div>

<div class="success custom-block">

<p class="custom-block-title">OK</p>

::: code-group

```ts [routes/index.get.ts]
import { define } from "@storona/express";

export default define((req, res) => {
  res.send("Hello world!");
});
```

:::

</div>

### Route Overriding

Files with overridden route or method must start with `!`.

For example, `apples/!someroute.get.ts`.

This rule is enforced to ensure that the route is overriden in a file structure. This makes it easier to understand the route structure of the application.

<div class="danger custom-block">

<p class="custom-block-title">ERROR</p>

::: code-group

```ts [routes/catch-foobar.get.ts]
import { define } from "@storona/express";

export const route = /foo|bar/;

export default define((req, res) => {
  res.send("Caught foobar!");
});
```

:::

</div>

<div class="success custom-block">

<p class="custom-block-title">OK</p>

::: code-group

```ts [routes/!catch-foobar.get.ts]
// Note the `!` in the file name
import { define } from "@storona/express";

export const route = /foo|bar/;

export default define((req, res) => {
  res.send("Caught foobar!");
});
```

:::

</div>
