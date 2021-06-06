import request from "supertest";

/**
 * Imports the server
 */
import { server } from "../../../server";

/**
 * Imports services
 */
import { TestingService, TestConfig } from "../../../services/testing";
import { ErrorTypes } from "../../../services/error";

/**
 * Defines the test config
 */
const config: TestConfig = {
  url: "/v1/articles/60b4fa10ded55343745e29d7",
  method: "get",
  middlewares: []
};

TestingService.use(config);

it("returns 404 if trying to get an article that doesn't exist", async () => {
  const { token } = await TestingService.createUserAccount();

  const response = await request(server)
    .get("/v1/articles/60b4fa10ded55343745e29d7")
    .set("Authorization", token)
    .send()
    .expect(404);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.ResourceNotFound);
});

it("returns 400 if the provided param id is invalid", async () => {
  const { token } = await TestingService.createUserAccount();

  const response = await request(server)
    .get("/v1/articles/this_is_an_invalid_id")
    .set("Authorization", token)
    .send()
    .expect(400);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.InvalidObjectID);
});

it("returns 200 and the article on a successful request", async () => {
  const { token, article, requestBody } = await TestingService.createArticle();

  expect(article.title).toBe(requestBody.title);
  expect(article.content).toBe(requestBody.content);

  const response = await request(server)
    .get(`/v1/articles/${article.id}`)
    .set("Authorization", token)
    .send(requestBody)
    .expect(200);

  expect(response.body.id).toBe(article.id);
  expect(response.body.title).toBe(article.title);
  expect(response.body.content).toBe(article.content);
});
