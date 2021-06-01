import request from "supertest";
import mongoose from "mongoose";

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
  const res = await request(server).post("/v1/comments").send({});
  expect(res.status).not.toEqual(404);
});

it("returns 400 if no Authorization header is provided", async () => {
  const res = await request(server).post("/v1/comments").send({}).expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("AuthorizationRequired");
});

it("returns 400 if the provided inputs are not valid", async () => {
  const { token } = await getAdminToken();

  const res = await request(server)
    .post("/v1/comments")
    .set("Authorization", token)
    .send({})
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(2);

  expect(errors[0].field).toBe("content");
  expect(errors[0].errorType).toBe("InputValidation");

  expect(errors[1].field).toBe("articleId");
  expect(errors[1].errorType).toBe("InputValidation");
});

it("returns 201 and the created comment", async () => {
  const { token, article } = await createArticle();

  const requestBody = {
    content: "Test content",
    articleId: article.id,
  };

  const res = await request(server)
    .post("/v1/comments")
    .set("Authorization", token)
    .send(requestBody)
    .expect(201);

  const { articleId, content } = res.body;

  expect(articleId).toBe(requestBody.articleId);
  expect(content).toBe(requestBody.content);
});

it("returns 404 when the article doesn't exist", async () => {
  const { token } = await createArticle();

  const requestBody = {
    content: "Test content",
    articleId: mongoose.Types.ObjectId().toHexString(),
  };

  const res = await request(server)
    .post("/v1/comments")
    .set("Authorization", token)
    .send(requestBody)
    .expect(404);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("ResourceNotFound");
});
