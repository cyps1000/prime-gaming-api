import request from "supertest";

/**
 * Imports the server
 */
import { server } from "../../../server";

/**
 * Imports services
 */
import { TestingService, TestConfig } from "../../../services/testing";
import {
  calculateTotalPages,
  PaginationService,
} from "../../../services/pagination";
import { ErrorTypes } from "../../../services/error";

/**
 * Defines the test config
 */
const config: TestConfig = {
  url: "/v1/comments",
  method: "get",
  middlewares: ["requireAdminAuth"],
};

TestingService.use(config);

it("returns 401 if the request is not made by an admin", async () => {
  const { token } = await TestingService.createUserAccount();

  const response = await request(server)
    .get("/v1/users")
    .set("Authorization", token)
    .send()
    .expect(401);

  const { errors } = response.body;

  expect(errors).toBeDefined();
  expect(errors[0].errorType).toBe(ErrorTypes.NotAuthorized);
  expect(errors.length).toBeGreaterThan(0);
});

it("returns 200 and a list of users", async () => {
  const { token } = await TestingService.createAdminAccount();

  /**
   * Defines the default pagination options
   */
  const {
    DEFAULT_CURRENT_PAGE,
    DEFAULT_LIMIT,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIR,
  } = PaginationService.getDefaultOptions();

  await TestingService.generateUsers(25);

  const response = await request(server)
    .get("/v1/users")
    .send()
    .set("Authorization", token)
    .expect(200);

  const { count, pages, page, limit, orderBy, orderDir, items } = response.body;
  const totalPages = calculateTotalPages(25, DEFAULT_LIMIT);

  expect(items.length).toBe(limit);
  expect(count).toBe(25);
  expect(pages).toBe(totalPages);
  expect(page).toBe(DEFAULT_CURRENT_PAGE);
  expect(limit).toBe(DEFAULT_LIMIT);
  expect(orderBy).toBe(DEFAULT_ORDER_BY);
  expect(orderDir).toBe(DEFAULT_ORDER_DIR);
});

it("returns 200 and correctly paginates", async () => {
  const { token } = await TestingService.createAdminAccount();
  await TestingService.generateUsers(15);

  const response = await request(server)
    .get("/v1/users?limit=2&page=3&orderBy=title&orderDir=asc")
    .set("Authorization", token)
    .send({})
    .expect(200);

  const { count, pages, page, limit, orderBy, orderDir, items } = response.body;
  const totalPages = calculateTotalPages(15, 2);

  expect(items.length).toBe(limit);
  expect(count).toBe(15);
  expect(pages).toBe(totalPages);
  expect(page).toBe(3);
  expect(limit).toBe(2);
  expect(orderBy).toBe("title");
  expect(orderDir).toBe("asc");
});

it("returns 200 and an empty array if over-paginated", async () => {
  const { token } = await TestingService.createAdminAccount();
  await TestingService.generateUsers(15);

  const response = await request(server)
    .get("/v1/users?limit=100&page=2&orderBy=title&orderDir=asc")
    .set("Authorization", token)
    .send({})
    .expect(200);

  const { count, pages, page, limit, orderBy, orderDir, items } = response.body;
  const totalPages = calculateTotalPages(15, 100);

  expect(items.length).toBe(0);
  expect(count).toBe(15);
  expect(pages).toBe(totalPages);
  expect(page).toBe(2);
  expect(limit).toBe(100);
  expect(orderBy).toBe("title");
  expect(orderDir).toBe("asc");
});
