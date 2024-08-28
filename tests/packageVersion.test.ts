import { version } from "package.json";
import { expect, test } from "vitest";
import { getPackageVersion, getPrefix } from "../src/utils";

test("getPackageVersion() correctly returns version", () => {
  expect(getPackageVersion()).toBe(version);
});

test("getPackageVersion() does not fall back", () => {
  expect(getPackageVersion()).toBe(version);
  expect(getPackageVersion()).not.toBe("1.0.0");
});

test("getPrefix() returns correct package version prefix", () => {
  expect(getPrefix(true)).toBe(`/v${version.split(".")[0]}`);
});

test("getPrefix() returns preset prefix", () => {
  expect(getPrefix("/v1")).toBe("/v1");
  expect(getPrefix("/v2")).toBe("/v2");
  expect(getPrefix("/v3")).toBe("/v3");
});
