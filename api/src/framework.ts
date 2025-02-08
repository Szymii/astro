import { Hono } from "hono";
import { faker } from "@faker-js/faker";
import { frameworksFixture } from "./freamworksFixture.js";

export const framework = new Hono();

// fetch("http://localhost:3000/framework?search=remix&page=1&perPage=10").then(data => data).catch(e => e)
const frameworks = frameworksFixture;

framework.get("/", async (c) => {
  const { search, page: pageParam, perPage: perPageParam } = c.req.query();
  const page = parseInt(pageParam) || 1;
  const perPage = parseInt(perPageParam) || 10;

  const filteredFrameworks = search
    ? frameworks.filter((fw) => fw.name.toLowerCase().includes(search))
    : frameworks;

  // Paginacja
  const total = filteredFrameworks.length;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedFrameworks = filteredFrameworks.slice(start, end);

  return c.json({
    page,
    perPage,
    total,
    total_pages: Math.ceil(total / perPage),
    data: paginatedFrameworks,
  });
});
