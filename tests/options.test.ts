import { expect, test } from "vitest";
import { defineOptions, fallbackOptions } from "../src/utils";

test("defineOptions() normalizes input", () => {
  expect(defineOptions("random/routes")).toStrictEqual({
    directory: "random/routes",
  });

  expect(
    defineOptions({
      directory: "random/routes",
      quiet: true,
    }),
  ).toStrictEqual({
    directory: "random/routes",
    quiet: true,
  });
});

test("fallbackOptions() replaces correctly", () => {
  expect(
    fallbackOptions({
      directory: "skiprouterreplace",
    }),
  ).toStrictEqual({
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
    }),
  ).toStrictEqual({
    directory: "routes",
    prefix: true,
    quiet: true,
    ignoreWarnings: true,
  });
});

test("fallbackOptions() fallbacks completely", () => {
  expect(fallbackOptions({})).toStrictEqual({
    directory: "routes",
    prefix: false,
    quiet: false,
    ignoreWarnings: false,
  });
});
