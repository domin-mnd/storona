import type { FastifyInstance } from "fastify";

export function detectFramework(
  instance: unknown,
): instance is FastifyInstance {
  if (typeof instance !== "object" || instance === null) return false;

  return (
    "pluginName" in instance && instance.pluginName === "fastify"
  );
}
