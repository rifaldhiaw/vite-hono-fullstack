import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
const app = new Hono();

app.get("/api/hello", (c) => {
  return c.json({
    hello: "Hono!",
  });
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
