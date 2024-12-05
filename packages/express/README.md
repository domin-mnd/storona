![Preview banner](public/preview-banner.png)

<h1>
  Overview
  <sup>
    <strong>
      <code>&nbsp;<a href="https://storona.domin.lol/guide/adapters/express/">Documentation</a>&nbsp;</code>
    </strong>
  </sup>
</h1>

This package is an adapter for [storona](https://storona.domin.lol/) file-based router. It allows to use [express](https://expressjs.com/) web framework with storona.

> Regarding all features and caveats, please refer to the documentation.

# Install

```bash
$ npm install storona express @storona/express
$ yarn add storona express @storona/express
$ pnpm add storona express @storona/express
$ bun i storona express @storona/express
```

# Usage

To use this adapter you need to create an express instance and pass it to the router. Then you can use the router as intended by storona design:

```typescript
import express from "express";
import cors from "cors";
import { createRouter } from "storona";
import { adapter } from "@storona/express";

function createServer() {
  const app = express();
  app.use(cors());

  return app;
}

const server = createServer();

await createRouter(server, {
  directory: "src/routes",
  adapter: adapter({
    // Set to true to use the package version. 1.0.0 -> /v1
    prefix: "/v1/api",
  }),
  quiet: false,
});

server.listen(3000, () => {
  console.info("API running on port 3000");
});
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
import { define } from "@storona/express";

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
