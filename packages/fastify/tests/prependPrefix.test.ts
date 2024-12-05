import { adapter } from "@/adapter";
import fastify from "fastify";
import { version } from "package.json";
import { expect, test } from "vitest";

test("on.route() correctly prefixes version", () => {
  const actions = adapter({
    prefix: true,
  })(fastify());

  expect(
    actions.on.route?.({
      endpoint: "/nested/route",
      method: "put",
    })
  ).toStrictEqual({
    endpoint: `/v${version.split(".")[0]}/nested/route`,
    method: "put",
  });

  expect(
    actions.on.route?.({
      endpoint: "/",
      method: "put",
    })
  ).toStrictEqual({
    endpoint: `/v${version.split(".")[0]}`,
    method: "put",
  });
});
