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
  const res = await request(server).get("/v1/comments/4325903459034").send({});
  expect(res.status).not.toEqual(404);
});

it("returns 404 if trying to get an comment that doesn't exist", async () => {
  const res = await request(server)
    .get("/v1/comments/60b4fa10ded55343745e29d7")
    .send()
    .expect(404);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("ResourceNotFound");
});

it("returns 400 if the provided param id is invalid", async () => {
  const res = await request(server)
    .get("/v1/comments/this_is_an_invalid_id")
    .send()
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("InvalidObjectID");
});

it("returns 200 and the comment on a successful request", async () => {
  const { token, article } = await createArticle();

  const requestBody = {
    content: "Test content",
    articleId: article.id,
  };

  const created = await request(server)
    .post("/v1/comments")
    .set("Authorization", token)
    .send(requestBody)
    .expect(201);

  const { content, articleId, id } = created.body;

  expect(articleId).toBe(requestBody.articleId);
  expect(content).toBe(requestBody.content);

  const res = await request(server)
    .get(`/v1/comments/${id}`)
    .send()
    .expect(200);

  expect(res.body.id).toBe(id);
  expect(res.body.content).toBe(content);
});
