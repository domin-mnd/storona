import { cp } from "fs/promises";
import { expect, test } from "vitest";
import { getHandler, getImport, getMethod, getRoute } from "@/import";

test("getImport() correctly handles extensions", async () => {
  await cp("tests/dummy", "node_modules/.cache/storona/dummy", {
    recursive: true,
  });

  const module = JSON.stringify(await getImport("dummy/common.ts"));
  const equalModule = JSON.stringify({
    default: {
      default: (_req: unknown, _res: unknown) => {},
      method: "get",
      route: "/some/nested/route",
    },
  });

  expect(module).toEqual(equalModule);
});

test("getHandler() correctly returns function", async () => {
  await cp("tests/dummy", "node_modules/.cache/storona/dummy", {
    recursive: true,
  });

  const module = await getImport("dummy/common.ts");
  const handler = getHandler(module);

  expect(handler).toBeTypeOf("function");
});

test("getMethod() correctly returns manually set method", async () => {
  await cp("tests/dummy", "node_modules/.cache/storona/dummy", {
    recursive: true,
  });

  const module = await getImport("dummy/common.ts");
  const method = getMethod(module);

  expect(method).toEqual("get");
});

test("getRoute() correctly returns manually set route", async () => {
  await cp("tests/dummy", "node_modules/.cache/storona/dummy", {
    recursive: true,
  });

  const module = await getImport("dummy/common.ts");
  const route = getRoute(module);

  expect(route).toEqual("/some/nested/route");
});
