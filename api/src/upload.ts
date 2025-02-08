import { Hono } from "hono";

export const upload = new Hono();

upload.post("/", async (c) => {
  const body = await c.req.parseBody();
  console.log(body); // File | string

  return c.json({ message: "File uploaded successfully" });
});
