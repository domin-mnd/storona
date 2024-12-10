# Quick Start

## Installation

To use Storona in your javascript project, you need to install the package with the adapter and call the `createRouter` function with provided instance and adapter function. This is essentially the only step required to get started.

Following guide will use Express as underlying framework.

To install packages, run:

::: code-group

```sh [npm]
$ npm install express storona @storona/express
```

```sh [yarn]
$ yarn add express storona @storona/express
```

```sh [pnpm]
$ pnpm add express storona @storona/express
```

```sh [bun]
$ bun add express storona @storona/express
```

:::

## Initializing Router

After that call the `createRouter` function with provided instance. Here's a quick example:

```ts twoslash
import express from "express";
import { createRouter } from "storona";
import { adapter } from "@storona/express";

const app = express();

createRouter(app, {
  adapter: adapter(),
});

app.listen(3000, () => {
  console.info("API running on port 3000");
});
```

## Create Routes

Now create a directory named `routes` in your project root. Inside the directory, create route files with the following naming convention:

![Route example](/route-example.png)

Endpoints are inherited from the file path and its name.

For example, the file `my-fruits/add.post.js` would create an endpoint with its route as `/my-fruits/add` and method as `POST`.

> [!NOTE]
> Naming your file `index.post.js` would create an endpoint with its route as `/`.

## Defining Routes

Each route file should export a default function that will be used as a handler for the route. Here's an example:

::: code-group

```ts twoslash [routes/other-fruits/apple.post.ts]
import { define } from "@storona/express";

interface Body {
  fruit: string;
}

export default define<{
  ReqBody: Body;
}>((req, res) => {
  const { fruit } = req.body;
  res.send(`Hello world! Here's your fruit: ${fruit}`);
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
<span style="color:#95C7AE;">▶ <span style="text-decoration:underline;">info</span></span> Registered POST /other-fruits/apple
<span style="color:#95C7AE;">▶ <span style="text-decoration:underline;">info</span></span> Registered POST /my-fruits/add
</code></pre></div>

## Configuring

Now you can configure the router instance by providing the config object as the second argument in the `createRouter` function. Here's an example:

```js twoslash {9,11-13}
import express from "express";
import { createRouter } from "storona";
import { adapter } from "@storona/express";

const app = express();

createRouter(app, {
  adapter: adapter({
    prefix: "/v1/api", // Prefix for all routes
  }),
  directory: "src/routes", // Custom route directory
  quiet: false, // Disable console output
  ignoreWarnings: false, // Suppress warnings
});

app.listen(3000, () => {
  console.info("API running on port 3000");
});
```

::: info
Head to [Reference](/reference/config) page for more configuration documentation.
:::
