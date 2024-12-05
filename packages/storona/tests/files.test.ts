import { expect, test } from "vitest";
import { getFiles } from "@/utils";

test("getFiles() correctly returns file tree", () => {
  const files = [...getFiles("tests/dummy")];

  try {
    expect(files).toStrictEqual([
      "tests/dummy/common.js",
      "tests/dummy/directory/is-not-empty.txt",
      "tests/dummy/directory/with/files.txt",
      "tests/dummy/module.js",
    ]);
  } catch {
    expect(files).toStrictEqual([
      "tests\\dummy\\common.js",
      "tests\\dummy\\directory\\is-not-empty.txt",
      "tests\\dummy\\directory\\with\\files.txt",
      "tests\\dummy\\module.js",
    ]);
  }
});
