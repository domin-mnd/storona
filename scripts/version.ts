import { $, Glob } from "bun";
import { createLogger } from "../packages/storona/src/logger";

const logger = createLogger({
  quiet: false,
});

await changeVersions();
export async function changeVersions() {
  const version = getArgvVersion();

  // workspaces key from package.json is not needed.
  const glob = new Glob("**/package.json");

  const packageJsons: string[] = [];

  for await (const path of glob.scan(".")) {
    if (path.includes("node_modules")) continue;

    const file = Bun.file(path);
    const json = await file.json();

    json.version = version;

    await Bun.write(file, JSON.stringify(json, null, 2));

    logger.info(`Bumped version in ${path} to ${version}`);
    packageJsons.push(path);
  }

  // Format these package.json files
  await $`bunx prettier --write ${packageJsons.join(" ")}`.quiet();
}

function getArgvVersion(): `${number}.${number}.${number}` {
  const version = process.argv[2];

  if (!version) {
    logger.error(
      "Version as argument not provided. Try `bun run release 1.1.1`"
    );
    process.exit(1);
  }

  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    logger.error(
      `Wrong version format provided.\n- Expected: 1.0.0\n- Received: ${version}`
    );
    process.exit(1);
  }

  return version as `${number}.${number}.${number}`;
}
