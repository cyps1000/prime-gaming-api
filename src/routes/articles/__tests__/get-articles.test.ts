import request from "supertest";
import faker from "faker";
import { Admin, Article } from "../../../models";

/**
 * Imports the server
 */
import { server } from "../../../server";

/**
 * Handles generating a list of articles
 */
const generateArticles = async (count: number) => {
  const admin = Admin.build({
    username: "admin-root",
    password: "Da2xVHtnPjB1l6!",
    role: "prime-admin",
  });

  await admin.save();

  if (admin) {
    const data: any[] = [];

    for (let i = 0; i < count; i++) {
      data.push({
        title: faker.lorem.sentence(5, 10),
        content: faker.lorem.paragraph(20),
        author: admin.id,
      });
    }

    Article.insertMany(data);
  }
};

/**
 * Handles calculating the total number of pages
 */
const calculateTotalPages = (count: number, limit: number) => {
  /**
   * Defines the total pages
   */
  const totalPages = Math.floor((count + limit - 1) / limit);

  return count < limit ? 1 : totalPages;
};

it("has a router handler listening for requests", async () => {
  const res = await request(server).get("/v1/articles").send({});
  expect(res.status).not.toEqual(404);
});

it("returns 200 and a list of articles", async () => {
  /**
   * Defines the default pagination options
   */
  const articlesCount = 25;
  const DEFAULT_CURRENT_PAGE = 1;
  const DEFAULT_LIMIT = 15;
  const DEFAULT_ORDER_BY = "createdAt";
  const DEFAULT_ORDER_DIR = "desc";

  await generateArticles(articlesCount);

  const res = await request(server).get("/v1/articles").send({}).expect(200);
  const totalPages = calculateTotalPages(articlesCount, DEFAULT_LIMIT);

  const { count, pages, page, limit, orderBy, orderDir, items } = res.body;

  expect(items.length).toBe(limit);
  expect(count).toBe(articlesCount);
  expect(pages).toBe(totalPages);
  expect(page).toBe(DEFAULT_CURRENT_PAGE);
  expect(limit).toBe(DEFAULT_LIMIT);
  expect(orderBy).toBe(DEFAULT_ORDER_BY);
  expect(orderDir).toBe(DEFAULT_ORDER_DIR);
});

it("returns 200 and correctly paginates", async () => {
  const articlesCount = 15;
  const request_limit = 2;
  const request_page = 3;
  const request_orderBy = "title";
  const request_orderDir = "asc";

  await generateArticles(articlesCount);
  const res = await request(server)
    .get(
      `/v1/articles?limit=${request_limit}&page=${request_page}&orderBy=${request_orderBy}&orderDir=${request_orderDir}`
    )
    .send({})
    .expect(200);

  const totalPages = calculateTotalPages(articlesCount, request_limit);
  const { count, pages, page, limit, orderBy, orderDir, items } = res.body;

  expect(items.length).toBe(limit);
  expect(count).toBe(articlesCount);
  expect(pages).toBe(totalPages);
  expect(page).toBe(request_page);
  expect(limit).toBe(request_limit);
  expect(orderBy).toBe(request_orderBy);
  expect(orderDir).toBe(request_orderDir);
});

it("returns 200 and an empty array if over-paginated", async () => {
  const articlesCount = 15;
  const request_limit = 100;
  const request_page = 2;
  const request_orderBy = "title";
  const request_orderDir = "asc";

  await generateArticles(articlesCount);
  const res = await request(server)
    .get(
      `/v1/articles?limit=${request_limit}&page=${request_page}&orderBy=${request_orderBy}&orderDir=${request_orderDir}`
    )
    .send({})
    .expect(200);

  const totalPages = calculateTotalPages(articlesCount, request_limit);
  const { count, pages, page, limit, orderBy, orderDir, items } = res.body;

  expect(items.length).toBe(0);
  expect(count).toBe(articlesCount);
  expect(pages).toBe(totalPages);
  expect(page).toBe(request_page);
  expect(limit).toBe(request_limit);
  expect(orderBy).toBe(request_orderBy);
  expect(orderDir).toBe(request_orderDir);
});
