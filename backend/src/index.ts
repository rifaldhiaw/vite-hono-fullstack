import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import "dotenv/config";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { getCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { appRouter } from "./router";

export type HonoType = {
  Variables: {};
  Bindings: {};
};

export type TrpcContext = {
  env: HonoType["Bindings"];
  setCookie: (serializeValue: string) => void;
  getCookie: (name: string) => string | undefined;
};

const app = new Hono<HonoType>();

app.use("*", logger());
app.use("*", csrf());
app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
  })
);

// -------------------------
// API
// -------------------------

app.get("/api/hello", (c) => {
  return c.json({
    hello: "Hono!",
  });
});

// -------------------------
// tRPC route
// -------------------------

app.use("/api/trpc/*", async (c) => {
  const res = fetchRequestHandler({
    router: appRouter,
    endpoint: "/api/trpc",
    req: c.req.raw,
    createContext: (): TrpcContext => ({
      env: env(c),
      setCookie: (serializeValue) => {
        c.res.headers.set("Set-Cookie", serializeValue);
      },
      getCookie: (name) => {
        return getCookie(c, name);
      },
    }),
  });

  return res;
});

// -------------------------
// Static file serving
// -------------------------

app.use("/*", (c, next) => {
  return serveStatic({ root: "./frontend/" })(c, next);
});

app.get("*", serveStatic({ path: "./frontend/index.html" }));

// -------------------------
// Server
// -------------------------

const port = 3000;
console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
