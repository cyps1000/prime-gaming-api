import request from "supertest";
import faker from "faker";
import { User } from "../../../models";

/**
 * Imports the server
 */
import { server } from "../../../server";

/**
 * Handles getting an admin token
 */
const getAdminToken = async () => {
  const resp = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "Da2xVHtnPjB1l6!"
    })
    .expect(201);

  return { token: resp.body.token };
};

/**
 * Handles generating a list of articles
 */
const generateUsers = async (count: number) => {
  const data: any[] = [];

  for (let i = 0; i < count; i++) {
    data.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });
  }

  User.insertMany(data);
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
  const res = await request(server).get("/v1/users").send({});
  expect(res.status).not.toEqual(404);
});

it("returns 400 if no Authorization header is provided", async () => {
  const res = await request(server).get("/v1/users").send().expect(400);

  const { errors } = res.body;

  expect(errors).toBeDefined();
  expect(errors[0].errorType).toBe("AuthorizationRequired");
  expect(errors.length).toBeGreaterThan(0);
});

it("returns 401 if the request is not made by an admin", async () => {
  const requestBody = {
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    password: "test1234"
  };

  const created = await request(server)
    .post("/v1/auth/register")
    .send(requestBody)
    .expect(201);

  const { token } = created.body;

  const res = await request(server)
    .get("/v1/users")
    .set("Authorization", token)
    .send()
    .expect(401);

  const { errors } = res.body;

  expect(errors).toBeDefined();
  expect(errors[0].errorType).toBe("NotAuthorized");
  expect(errors.length).toBeGreaterThan(0);
});

it("returns 200 and a list of users", async () => {
  const { token } = await getAdminToken();

  /**
   * Defines the default pagination options
   */
  const usersCount = 25;
  const DEFAULT_CURRENT_PAGE = 1;
  const DEFAULT_LIMIT = 15;
  const DEFAULT_ORDER_BY = "createdAt";
  const DEFAULT_ORDER_DIR = "desc";

  await generateUsers(usersCount);

  const res = await request(server)
    .get("/v1/users")
    .send()
    .set("Authorization", token)
    .expect(200);
  const totalPages = calculateTotalPages(usersCount, DEFAULT_LIMIT);

  const { count, pages, page, limit, orderBy, orderDir, items } = res.body;

  expect(items.length).toBe(limit);
  expect(count).toBe(usersCount);
  expect(pages).toBe(totalPages);
  expect(page).toBe(DEFAULT_CURRENT_PAGE);
  expect(limit).toBe(DEFAULT_LIMIT);
  expect(orderBy).toBe(DEFAULT_ORDER_BY);
  expect(orderDir).toBe(DEFAULT_ORDER_DIR);
});

it("returns 200 and correctly paginates", async () => {
  const { token } = await getAdminToken();

  const usersCount = 15;
  const request_limit = 2;
  const request_page = 3;
  const request_orderBy = "title";
  const request_orderDir = "asc";

  await generateUsers(usersCount);
  const res = await request(server)
    .get(
      `/v1/users?limit=${request_limit}&page=${request_page}&orderBy=${request_orderBy}&orderDir=${request_orderDir}`
    )
    .set("Authorization", token)
    .send({})
    .expect(200);

  const totalPages = calculateTotalPages(usersCount, request_limit);
  const { count, pages, page, limit, orderBy, orderDir, items } = res.body;

  expect(items.length).toBe(limit);
  expect(count).toBe(usersCount);
  expect(pages).toBe(totalPages);
  expect(page).toBe(request_page);
  expect(limit).toBe(request_limit);
  expect(orderBy).toBe(request_orderBy);
  expect(orderDir).toBe(request_orderDir);
});

it("returns 200 and an empty array if over-paginated", async () => {
  const { token } = await getAdminToken();

  const usersCount = 15;
  const request_limit = 100;
  const request_page = 2;
  const request_orderBy = "title";
  const request_orderDir = "asc";

  await generateUsers(usersCount);
  const res = await request(server)
    .get(
      `/v1/users?limit=${request_limit}&page=${request_page}&orderBy=${request_orderBy}&orderDir=${request_orderDir}`
    )
    .set("Authorization", token)
    .send({})
    .expect(200);

  const totalPages = calculateTotalPages(usersCount, request_limit);
  const { count, pages, page, limit, orderBy, orderDir, items } = res.body;

  expect(items.length).toBe(0);
  expect(count).toBe(usersCount);
  expect(pages).toBe(totalPages);
  expect(page).toBe(request_page);
  expect(limit).toBe(request_limit);
  expect(orderBy).toBe(request_orderBy);
  expect(orderDir).toBe(request_orderDir);
});
