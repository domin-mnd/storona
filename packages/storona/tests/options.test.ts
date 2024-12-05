import { expect, test } from "vitest";
import { defineOptions, fallbackOptions, undefinedAdapter } from "@/utils";

test("defineOptions() normalizes input", () => {
  expect(defineOptions("random/routes")).toStrictEqual({
    directory: "random/routes",
  });

  expect(
    defineOptions({
      directory: "random/routes",
      quiet: true,
    })
  ).toStrictEqual({
    directory: "random/routes",
    quiet: true,
  });
});

test("fallbackOptions() replaces correctly", () => {
  expect(
    fallbackOptions({
      directory: "skiprouterreplace",
    })
  ).toMatchObject({
    directory: "skiprouterreplace",
    prefix: false,
    quiet: false,
    ignoreWarnings: false,
  });

  expect(
    fallbackOptions({
      prefix: true,
      quiet: true,
      ignoreWarnings: true,
    })
  ).toMatchObject({
    directory: "routes",
    prefix: true,
    quiet: true,
    ignoreWarnings: true,
  });
});

test("fallbackOptions() fallbacks completely", () => {
  expect(fallbackOptions({})).toMatchObject({
    directory: "routes",
    prefix: false,
    quiet: false,
    ignoreWarnings: false,
  });
});
