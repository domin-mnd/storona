# Quick Start

## Installation

To use Storona in your javascript project, you need to install the package and call the `createRouter` function with provided instance. This is essentially the only step required to get started.

To install the package, run:

::: code-group

```sh [npm]
$ npm install storona
```

```sh [yarn]
$ yarn add storona
```

```sh [pnpm]
$ pnpm add storona
```

```sh [bun]
$ bun add storona
```

:::

## Initializing Router

After that call the `createRouter` function with provided instance. It detects your framework automatically. Here's a quick example:

::: code-group

```js:line-numbers [Express]
const express = require("express");
const { createRouter } = require("storona");

const app = express();

createRouter(app);

app.listen(3000, () => {
  console.info("API running on port 3000");
});
```

```js:line-numbers [Fastify]
const fastify = require("fastify");
const { createRouter } = require("storona");

const app = fastify();

createRouter(app);

app.listen(
  {
    port: 3000
  },
  () => {
    console.info("API running on port 3000");
  }
);
```

:::

## Create Routes

Now create a directory named `routes` in your project root. Inside the directory, create route files with the following naming convention:

![Route example](/route-example.png)

Endpoints are inherited from the file path and its name. Naming your file `index.post.js` would create an endpoint with its subpath as `/` and method as `POST`.

## Defining Routes

Each route file should export a default function that will be used as a handler for the route. Here's an example:

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

This handler will be called each time the route is matched.

## Running The Server

Running your server would output registered routes in the console. You can now test your routes using your favorite API client.

<div class="language-sh"><pre><code>$ npm start<br>
> your-app@1.0.0 start
> node .<br>
API running on port 3000
<span style="color:#95C7AE;">▶ <span style="text-decoration:underline;">info</span></span> Registered GET /
<span style="color:#95C7AE;">▶ <span style="text-decoration:underline;">info</span></span> Registered GET /other-fruits/apple
<span style="color:#95C7AE;">▶ <span style="text-decoration:underline;">info</span></span> Registered POST /my-fruits/add
</code></pre></div>

## Configuring

Now you can configure the router instance by providing the config object as the second argument in the `createRouter` function. Here's an example:

::: code-group

```js:line-numbers [Express] {7-10}
const express = require("express");
const { createRouter } = require("storona");

const app = express();

createRouter(app, {
  directory: "src/routes", // Custom route directory
  prefix: "/v1/api", // Prefix for all routes
  quiet: false, // Disable console output
  ignoreWarnings: false, // Suppress warnings
});

app.listen(3000, () => {
  console.info("API running on port 3000");
});
```

```js:line-numbers [Fastify] {7-10}
const fastify = require("fastify");
const { createRouter } = require("storona");

const app = fastify();

createRouter(app, {
  directory: "src/routes", // Custom route directory
  prefix: "/v1/api", // Prefix for all routes
  quiet: false, // Disable console output
  ignoreWarnings: false, // Suppress warnings
});

app.listen(
  {
    port: 3000
  },
  () => {
    console.info("API running on port 3000");
  }
);
```

:::

::: info
Head to [Reference](/reference/config) page for more configuration documentation.
:::
