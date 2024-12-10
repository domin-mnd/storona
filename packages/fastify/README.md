![Preview banner](public/preview-banner.png)

<h1>
  Overview
  <sup>
    <strong>
      <code>&nbsp;<a href="https://storona.domin.lol/guide/adapters/fastify/">Documentation</a>&nbsp;</code>
    </strong>
  </sup>
</h1>

This package is an adapter for [storona](https://storona.domin.lol/) file-based router. It allows to use [fastify](https://fastify.dev/) web framework with storona.

> Regarding all features and caveats, please refer to the documentation.

# Install

```bash
$ npm install storona fastify @storona/fastify
$ yarn add storona fastify @storona/fastify
$ pnpm add storona fastify @storona/fastify
$ bun i storona fastify @storona/fastify
```

# Usage

To use this adapter you need to create an fastify instance and pass it to the router. Then you can use the router as intended by storona design:

```typescript
import Fastify from "fastify";
import { createRouter } from "storona";
import { adapter } from "@storona/fastify";

function createServer() {
  const app = Fastify();
  return app;
}

const server = createServer();

createRouter(server, {
  directory: "src/routes",
  adapter: adapter({
    // Set to true to use the package version. 1.0.0 -> /v1
    prefix: "/v1/api",
  }),
  quiet: false,
});

server.listen(
  {
    port: 3000,
  },
  () => {
    console.info("API running on port 3000");
  }
);
```

## Result

```
.
└─ src
   ├─ routes
   │  ├─ directory
   │  │  ├─ [fruit].get.js   --> GET  /v1/api/directory/:fruit
   │  │  └─ index.put.mjs    --> PUT  /v1/api/directory
   │  ├─ apple.post.ts       --> POST /v1/api/apple
   │  └─ index.get.jsx       --> GET  /v1/api
   └─ index.js
```

## Route Example

```typescript
// src/routes/apple.post.ts
import { define } from "@storona/fastify";

interface ReqBody {
  fruit: string;
}

export default define<{
  ReqBody: ReqBody;
}>((req, res) => {
  const { fruit } = req.body;
  res.send(`My fruit is ${fruit}!`);
});
```

# License

This project is under [MIT](https://choosealicense.com/licenses/mit/) license. You can freely use it for your own purposes.
