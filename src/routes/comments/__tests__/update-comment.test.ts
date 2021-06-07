import request from "supertest";
import faker from "faker";

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
 * Handles getting an admin token
 */
const getUserToken = async () => {
  const resp = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: faker.name.findName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
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
    content: "Test content"
  };

  const res = await request(server)
    .post("/v1/articles")
    .set("Authorization", token)
    .send(requestBody)
    .expect(201);

  return { article: res.body, token };
};

it("has a router handler listening for requests", async () => {
  const res = await request(server).put("/v1/comments/4325903459034").send({});
  expect(res.status).not.toEqual(404);
});

it("returns 400 if no Authorization header is provided", async () => {
  const res = await request(server)
    .put("/v1/comments/4325903459034")
    .send({})
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("AuthorizationRequired");
});

it("returns 404 if trying to ban a comment that doesn't exist", async () => {
  const { token } = await getAdminToken();

  const requestBodyModerated = {
    content: "Test content - moderated"
  };

  const res = await request(server)
    .put("/v1/comments/60b4fa10ded55343745e29d7")
    .set("Authorization", token)
    .send(requestBodyModerated)
    .expect(404);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("ResourceNotFound");
});

it("returns 400 if the provided param id is invalid", async () => {
  const { token, article } = await createArticle();

  const requestBody = {
    content: "Test content",
    articleId: article.id
  };

  const res = await request(server)
    .put("/v1/comments/this_is_an_invalid_id")
    .set("Authorization", token)
    .send(requestBody)
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("InvalidObjectID");
});

it("returns 404 if a user is trying to update a comment that doesn't belong to him", async () => {
  const { article } = await createArticle();
  const { token: firstUser } = await getUserToken();
  const { token: secondUser } = await getUserToken();

  const requestBody = {
    content: "Test content",
    articleId: article.id
  };

  const requestBodyChanged = {
    content: "Test content - changed"
  };

  const created = await request(server)
    .post("/v1/comments")
    .set("Authorization", firstUser)
    .send(requestBody)
    .expect(201);

  const { id } = created.body;

  const res = await request(server)
    .put(`/v1/comments/${id}`)
    .set("Authorization", secondUser)
    .send(requestBodyChanged)
    .expect(401);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("NotAuthorized");
});

it("returns 400 if an admin is trying to update a comment that doesn't belong to him", async () => {
  const { token, article } = await createArticle();
  const { token: userToken } = await getUserToken();

  const requestBody = {
    content: "Test content",
    articleId: article.id
  };

  const requestBodyChanged = {
    content: "Test content - changed"
  };

  const created = await request(server)
    .post("/v1/comments")
    .set("Authorization", userToken)
    .send(requestBody)
    .expect(201);

  const { id } = created.body;

  const res = await request(server)
    .put(`/v1/comments/${id}`)
    .set("Authorization", token)
    .send(requestBodyChanged)
    .expect(401);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("NotAuthorized");
});

it("returns 200 when the request is successful", async () => {
  const { token, article } = await createArticle();

  const requestBody = {
    content: "Test content",
    articleId: article.id
  };

  const requestBodyChanged = {
    content: "Test content - changed"
  };

  const created = await request(server)
    .post("/v1/comments")
    .set("Authorization", token)
    .send(requestBody)
    .expect(201);

  const { id } = created.body;

  const res = await request(server)
    .put(`/v1/comments/${id}`)
    .set("Authorization", token)
    .send(requestBodyChanged)
    .expect(200);

  const { success, comment: responseComment } = res.body;

  expect(success).toBe(true);
  expect(responseComment.id).toBe(id);
  expect(responseComment.content).toBe(requestBodyChanged.content);
});
