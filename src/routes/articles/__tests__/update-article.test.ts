import request from "supertest";

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
      password: "Da2xVHtnPjB1l6!",
    })
    .expect(201);

  return { token: resp.body.token };
};

/**
 * Handles creating an article
 */
const createArticle = async () => {
  const { token } = await getAdminToken();

  const requestBody = {
    title: "Test Article",
    content: "Test content",
  };

  const res = await request(server)
    .post("/v1/articles")
    .set("Authorization", token)
    .send(requestBody)
    .expect(201);

  return { article: res.body, token };
};

it("has a router handler listening for requests", async () => {
  const res = await request(server).put("/v1/articles/4325903459034").send({});
  expect(res.status).not.toEqual(404);
});

it("returns 400 if no Authorization header is provided", async () => {
  const res = await request(server)
    .put("/v1/articles/60b5972e408e6f2970045bee")
    .send({})
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("AuthorizationRequired");
});

it("returns 400 if the article wasn't found", async () => {
  const { token } = await getAdminToken();

  const requestBody = {
    title: "Test Article - CHANGED",
    content: "Test content - CHANGED",
  };

  const res = await request(server)
    .put("/v1/articles/60b5972e408e6f2970045bee")
    .set("Authorization", token)
    .send(requestBody)
    .expect(404);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("ResourceNotFound");
});

it("returns 400 if the provided inputs are not valid", async () => {
  const { article, token } = await createArticle();

  const res = await request(server)
    .put(`/v1/articles/${article.id}`)
    .set("Authorization", token)
    .send({})
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(2);

  expect(errors[0].field).toBe("title");
  expect(errors[0].errorType).toBe("InputValidation");

  expect(errors[1].field).toBe("content");
  expect(errors[1].errorType).toBe("InputValidation");
});

it("returns 200 and the updated article", async () => {
  const { article, token } = await createArticle();

  const requestBody = {
    title: "Test Article - CHANGED",
    content: "Test content - CHANGED",
  };

  const res = await request(server)
    .put(`/v1/articles/${article.id}`)
    .set("Authorization", token)
    .send(requestBody)
    .expect(200);

  const { title, content } = res.body;

  expect(title).toBe(requestBody.title);
  expect(content).toBe(requestBody.content);
});
