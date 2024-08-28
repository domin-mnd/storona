import type { FrameworkAdapter } from "@/adapter";
import { ExpressAdapter } from "./express";
import { FastifyAdapter } from "./fastify";

type Adapters = (typeof FrameworkAdapter<any, any, any, any>)[];

export const adapters: Adapters = [ExpressAdapter, FastifyAdapter];
