import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  cors({
    origin: "*",
  }),
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  console.log(body); // File | string

  return c.json({ message: "File uploaded successfully" });
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
